import "./nodejs/fs.jsx";
import "./nodejs/path.jsx";

class fsextra
{
    static function isDirectory(filepath : string) : boolean
    {
        if (fs.existsSync(filepath))
        {
            var stats = fs.statSync(filepath);
            return stats.isDirectory();
        }
        return false;
    }

    static function _copy (srcPath : string, destPath : string) : void
    {
        if (fsextra.isDirectory(destPath))
        {
            var destPath = path.join(destPath, path.basename(srcPath));
        }
        fs.writeFileSync(destPath, fs.readFileSync(srcPath, 'utf8'), 'utf8');
    }

    static function copy (src : string, dest : string) : void
    {
        if (fsextra.isDirectory(src))
        {
            if (!fs.existsSync(dest))
            {
                fs.mkdirSync(dest);
            }
            var contents = fs.readdirSync(src);
            for (var i = 0; i < contents.length; i++)
            {
                var childSrcPath = path.join(src, contents[i]);
                var childDestPath = path.join(dest, contents[i]);
                fsextra.copy(childSrcPath, childDestPath);
            }
        }
        else
        {
            fsextra._copy(src, dest);
        }
    }
}

