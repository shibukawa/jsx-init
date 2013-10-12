import "console.jsx";
import "./nodejs/nodejs.jsx";
import "./nodejs/fs.jsx";
import "./nodejs/path.jsx";
import "hogan.jsx";
import "./fs-extra.jsx";

class Template
{
    var name : string;
    var path : string;
    var description : string;
    var dirs : string[];
    var templates : string[];
    var copyfiles : variant[];
    var licenses : string[];
    var extraQuestions : variant[];

    function constructor(name : string, templateDir : string, filepath : string)
    {
        this.name = name;
        var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        this.description = json['description'] as string;
        this.dirs = json['dirs'] as string[];
        this.templates = json['templates'] as string[];
        this.copyfiles = json['copyfiles'] as variant[];
        if (json['licenses'])
        {
            this.licenses = json['licenses'] as string[];
        }
        else
        {
            this.licenses = null;
        }
        if (json['extraQuestions'])
        {
            this.extraQuestions = json['extraQuestions'] as variant[];
        }
        else
        {
            this.extraQuestions = [] : variant[];
        }
        this.path = templateDir;
    }

    function generate(result : Map.<variant>, licenseSrcPath : string) : void
    {
        for (var i = 0; i < this.dirs.length; i++)
        {
            var dirpath = path.join(process.cwd(), this.dirs[i]);
            if (!fs.existsSync(dirpath))
            {
                console.log('creating folder ...', this.dirs[i]);
                fs.mkdirSync(dirpath);
            }
        }

        for (var i = 0; i < this.copyfiles.length; i++)
        {
            if (typeof this.copyfiles[i] == 'string')
            {
                var filename = this.copyfiles[i] as string;
                var srcPath = this.srcPath(filename, result);
                var destPath = this.destPath(filename, result);
                var displayName = this.fixFilePath(filename, result);
            }
            else
            {
                var fileEntry = this.copyfiles[i] as string[];
                var srcPath = this.srcPath(fileEntry[0], result);
                var destPath = this.destPath(fileEntry[1], result);
                var displayName = this.fixFilePath(fileEntry[0], result);
            }
            console.log('copying ...', displayName);
            fsextra.copy(srcPath, destPath);
        }

        console.log('creating ... LICENSE.md');
        var licenseDestPath = path.join(process.cwd(), "LICENSE.md");
        this.applyTemplate(licenseSrcPath, licenseDestPath, result);

        for (var i = 0; i < this.templates.length; i++)
        {
            var srcPath = path.join(this.path, this.templates[i]);
            var destPath = this.destPath(this.templates[i], result);
            console.log('creating ...', this.templates[i].replace('__name__', result['filebasename'] as string));
            this.applyTemplate(srcPath, destPath, result);
        }
    }

    function fixFilePath(filepath : string, context : Map.<variant>) : string
    {
        var fixfilepath = filepath.replace(/__name__/g, context['filebasename'] as string).replace(/__dot__/, '.');
        return Hogan.compile(fixfilepath).render(context);
    }

    function srcPath(filepath : string, context : Map.<variant>) : string
    {
        return path.resolve(this.path, Hogan.compile(filepath).render(context));
    }

    function destPath(filepath : string, context : Map.<variant>) : string
    {
        return this.fixFilePath(path.join(process.cwd(), filepath), context);
    }

    function applyTemplate(srcPath : string, destPath : string, context : Map.<variant>) : void
    {
        var template = Hogan.compile(fs.readFileSync(srcPath, 'utf8'));
        fs.writeFileSync(destPath, template.render(context), 'utf8');
    }
}

