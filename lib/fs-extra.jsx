import "./nodejs/fs.jsx";
import "./nodejs/path.jsx";

class fsextra
{
    static function copy (srcPath : string, destPath : string) : void
    {
        fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'), 'utf8');
    }

    static function recursiveCopy (src : string, dest : string) : void
    {
        var stats = fs.statSync(src);
        var basename = path.basename(src);
        var destpath = path.join(dest, basename);

        if (stats.isDirectory())
        {
            if (!fs.existsSync(destpath))
            {
                fs.mkdirSync(destpath);
            }
            var contents = fs.readdirSync(src);
            for (var i = 0; i < contents.length; i++)
            {
                fsextra.recursiveCopy(path.join(src, contents[i]), destpath);
            }
        }
        else
        {
            fsextra.copy(src, destpath);
        }
    }
}

