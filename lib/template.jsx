import "console.jsx";
import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "hogan.jsx";

class Template
{
    var name : string;
    var path : string;
    var description : string;
    var dirs : string[];
    var templates : string[];
    var copyfiles : string[];
    var licenses : string[];

    function constructor(name : string, templateDir : string, filepath : string)
    {
        this.name = name;
        var json = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        this.description = json['description'] as string;
        this.dirs = json['dirs'] as string[];
        this.templates = json['templates'] as string[];
        this.copyfiles = json['copyfiles'] as string[];
        if (json['licenses'])
        {
            this.licenses = json['licenses'] as string[];
        }
        else
        {
            this.licenses = null;
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
            var srcPath = path.join(this.path, this.copyfiles[i]);
            var destPath = this.destPath(this.copyfiles[i], result);
            console.log('copying ...', this.copyfiles[i].replace('__name__', result['name'] as string));
            fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'), 'utf8');
        }

        console.log('creating ... LICENSE.md');
        var licenseDestPath = path.join(process.cwd(), "LICENSE.md");
        this.applyTemplate(licenseSrcPath, licenseDestPath, result);

        for (var i = 0; i < this.templates.length; i++)
        {
            var srcPath = path.join(this.path, this.templates[i]);
            var destPath = this.destPath(this.templates[i], result);
            console.log('creating ...', this.templates[i].replace('__name__', result['name'] as string));
            this.applyTemplate(srcPath, destPath, result);
        }
    }

    function destPath(filepath : string, context : Map.<variant>) : string
    {
        var result = path.join(process.cwd(), filepath);
        if (result.indexOf('__name__') != -1)
        {
            result = result.replace(/__name__/g, context['name'] as string);
        }
        return result;
    }

    function applyTemplate(srcPath : string, destPath : string, context : Map.<variant>) : void
    {
        var template = Hogan.compile(fs.readFileSync(srcPath, 'utf8'));
        fs.writeFileSync(destPath, template.render(context), 'utf8');
    }
}

