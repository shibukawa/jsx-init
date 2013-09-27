import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "prompt.jsx";
import "template.jsx";

class Setting
{
    var templates : Template[];
    var licenses: string[];
    var name : string;
    var author : string;
    var mail : string;
    var githubAccount : string;
    var bitbucketAccount : string;
    var jsxinitDir : string;

    function constructor(userDir : string)
    {
        var templates = {} : Map.<Template>;
        this.jsxinitDir = path.join(userDir, '.jsxinit');
        if (!fs.existsSync(this.jsxinitDir))
        {
            fs.mkdirSync(this.jsxinitDir);
        }
        this.getTemplateDirs(path.resolve(node.__dirname, '../share/templates'), templates);
        this.getTemplateDirs(path.join(userDir, '.jsxinit'), templates);

        var files = fs.readdirSync(path.resolve(node.__dirname, '../share/licenses'));
        this.licenses = [] : string[];
        for (var i = 0; i < files.length; i++)
        {
            if (path.extname(files[i]) == '.md')
            {
                this.licenses.push(files[i].slice(0, -3));
            }
        }
        this.author = path.basename(userDir);
        this.name = path.basename(process.cwd());
        var settingFilePath = path.resolve(this.jsxinitDir, 'jsxinit.json');
        if (fs.existsSync(settingFilePath))
        {
            var json = JSON.parse(fs.readFileSync(settingFilePath, 'utf8'));
            if (json['author'])
            {
                this.author = json['author'] as string;
            }
            if (json['mail'])
            {
                this.mail = json['mail'] as string;
            }
            if (json['bitbucketAccount'])
            {
                this.bitbucketAccount = json['bitbucketAccount'] as string;
                this.author = this.bitbucketAccount;
            }
            if (json['githubAccount'])
            {
                this.githubAccount = json['githubAccount'] as string;
                this.author = this.githubAccount;
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

    function getTemplateQuestion() : Selection
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

        var result = new Selection('template', 'What type of project do you want to create?',
                description.join('\n'), this.templates.length);
        return result;
    }
    
    function getLicenseQuestion (selectedTemplate : int) : Selection
    {
        var licenses = this.getCompatibleLicenseList(selectedTemplate);
        var description = [] : string[];
        for (var i = 0; i < licenses.length; i++)
        {
            description.push((i + 1) + ': ' + licenses[i]);
        }
        var result = new Selection('license', 'Which license do you use?',
                description.join('\n'), this.templates.length);
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

    function save() : void
    {
        var settingFilePath = path.resolve(this.jsxinitDir, 'jsxinit.json');
        var result = {
            author: this.author,
            mail: this.mail,
            githubAccount: this.githubAccount,
            bitbucketAccount: this.bitbucketAccount
        };
        fs.writeFileSync(settingFilePath, JSON.stringify(result, null, 4), 'utf8');
    }
}
