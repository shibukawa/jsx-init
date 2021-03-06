import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "prompt.jsx";
import "template.jsx";

class Setting
{
    var templates : Template[];
    var licenses : string[];
    var licenseNames : string[];
    var name : string;
    var author : string;
    var mail : string;
    var githubAccount : string;
    var bitbucketAccount : string;
    var jsxinitDir : string;
    var version : string;
    var defaultJson : Map.<string>;

    function constructor(userDir : string)
    {
        var packageJson = fs.readFileSync(path.resolve(node.__dirname, '../package.json'), 'utf8');
        this.version = JSON.parse(packageJson)['version'] as string;

        var templates = {} : Map.<Template>;
        this.jsxinitDir = path.join(userDir, '.jsxinit');
        if (!fs.existsSync(this.jsxinitDir))
        {
            fs.mkdirSync(this.jsxinitDir);
        }
        this.getTemplateDirs(path.resolve(node.__dirname, '../share/templates'), templates);
        this.getTemplateDirs(path.join(userDir, '.jsxinit'), templates);

        var licenseAltNameSrc = fs.readFileSync(path.resolve(node.__dirname, '../share/licenses/license.json'), 'utf8');
        var licenseAltNames = JSON.parse(licenseAltNameSrc) as Map.<string>;
        var files = fs.readdirSync(path.resolve(node.__dirname, '../share/licenses'));
        this.licenses = [] : string[];
        this.licenseNames = [] : string[];
        for (var i = 0; i < files.length; i++)
        {
            if (path.extname(files[i]) == '.md')
            {
                var filename = files[i];
                this.licenses.push(filename.slice(0, -3));
                if (licenseAltNames[filename])
                {
                    this.licenseNames.push(licenseAltNames[filename]);
                }
                else
                {
                    this.licenseNames.push(filename.slice(0, -3));
                }
            }
        }
        this.defaultJson = {
            author: path.basename(userDir),
            name: path.basename(process.cwd()),
            OriginalName: path.basename(process.cwd())
        };
        var settingFilePath = path.resolve(this.jsxinitDir, 'jsxinit.json');
        if (fs.existsSync(settingFilePath))
        {
            var json = JSON.parse(fs.readFileSync(settingFilePath, 'utf8')) as Map.<string>;
            for (var key in json)
            {
                if (json.hasOwnProperty(key))
                {
                    this.defaultJson[key] = json[key];
                }
            }
            if (json['bitbucketAccount'] && !json['author'])
            {
                this.defaultJson['author'] = json['bitbucketAccount'] as string;
            }
            if (json['githubAccount'] && !json['author'])
            {
                this.defaultJson['author'] = json['githubAccount'] as string;
            }
        }
        this.templates = [] : Template[];
        for (var key in templates)
        {
            if (templates.hasOwnProperty(key))
            {
                this.templates.push(templates[key]);
            }
        }
    }

    function getTemplateDirs(dirroot : string, result : Map.<Template>) : void
    {
        var dirs = fs.readdirSync(dirroot);
        for (var i = 0; i < dirs.length; i++)
        {
            var settingPath = path.resolve(dirroot, dirs[i], 'template.json');
            if (fs.existsSync(settingPath))
            {
                result[dirs[i]] = new Template(dirs[i], path.resolve(dirroot, dirs[i]), settingPath);
            }
        }
    }

    function getTemplateDescriptions() : string[]
    {
        var maxLength = -1000;
        for (var i = 0; i < this.templates.length; i++)
        {
            var template = this.templates[i];
            maxLength = Math.max(maxLength, template.name.length);
        }
        var description = [] : string[];
        for (var i = 0; i < this.templates.length; i++)
        {
            var template = this.templates[i];
            var str = [(i + 1) + ": " + template.name];
            for (var j = template.name.length; j < maxLength; j++)
            {
                str.push(' ');
            }
            str.push(' - ' + template.description);
            description.push(str.join(''));
        }
        return description;
    }

    function getTemplateQuestion() : Selection
    {
        var description = this.getTemplateDescriptions();
        var result = new Selection('template', 'What type of project do you want to create?',
                description.join('\n'), this.templates.length);
        return result;
    }

    function getExtraQuestions (selectedTemplate : int) : Question[]
    {
        var result = [] : Question[];
        var template = this.templates[selectedTemplate];
            var questions = template.extraQuestions as variant[];
            for (var i = 0; i < questions.length; i++)
            {
            var json = questions[i] as Map.<variant>;
            var key = json['key'] as string;
            var question = json['question'] as string;
            switch (json['type'] as string)
            {
            case 'open':
                var defaultValue = json['defaultValue'] ? json['default'] as string : '';
                var allowEmpty = json['allowEmpty'] as boolean;
                var openQuestion = new OpenQuestion(key, allowEmpty, question, defaultValue);
                if (json['persistent'])
                {
                    openQuestion.setPersistent(true);
                }
                result.push(openQuestion);
                break;
            case 'path':
                var defaultValue = json['defaultValue'] ? json['default'] as string : '';
                var allowEmpty = json['allowEmpty'] as boolean;
                var pathQuestion = new PathQuestion(key, allowEmpty, question, defaultValue);
                if (json['persistent'])
                {
                    pathQuestion.setPersistent(true);
                }
                result.push(pathQuestion);
                break;
            case 'select':
                break;
            case 'yesno':
                break;
            }
        }
        return result;
    }

    function getLicenseQuestion (selectedTemplate : int) : Selection
    {
        var licenses = this.getCompatibleLicenseList(selectedTemplate);
        var description = [] : string[];
        for (var i = 0; i < this.licenseNames.length; i++)
        {
            description.push((i + 1) + ': ' + this.licenseNames[i]);
        }
        var result = new Selection('license', 'Which license do you use?',
                description.join('\n'), licenses.length);
        return result;
    }

    function getCompatibleLicenseList (selectedTemplate : int) : string[]
    {
        var compatibleLicense = this.templates[selectedTemplate].licenses;
        var result = [] : string[];
        for (var i = 0; i < this.licenses.length; i++)
        {
            if (compatibleLicense && compatibleLicense.indexOf(this.licenses[i]) == -1)
            {
                continue;
            }
            result.push(this.licenses[i]);
        }
        return result;
    }

    function getLicensePath (selectedTemplate : int, licenseIndex : int) : string
    {
        var licenses = this.getCompatibleLicenseList(selectedTemplate);
        return path.resolve(node.__dirname, '../share/licenses', licenses[licenseIndex] + '.md');
    }

    function getLicenseName (selectedTemplate : int, licenseIndex : int) : string
    {
        var licenses = this.getCompatibleLicenseList(selectedTemplate);
        var filename = licenses[licenseIndex];
        var masterIndex = this.licenses.indexOf(filename);
        return this.licenseNames[masterIndex];
    }

    function save (persistentData : Map.<string>) : void
    {
        var settingFilePath = path.resolve(this.jsxinitDir, 'jsxinit.json');
        fs.writeFileSync(settingFilePath, JSON.stringify(persistentData, null, 4), 'utf8');
    }
}
