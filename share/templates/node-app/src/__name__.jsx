/**
 * {{& Name }}
 *
 * {{& description }}
 *
 * [sample] This comment is document for class. You can use some HTML tags.
 *
 * @author {{& author }}
 *
 * @see {{& homepage }}
 *
 * License: {{& licensename }}
 */

import "console.jsx";
import "js/nodejs.jsx";
import "getopt.jsx";

/**
 * [sample] Sample class to use node.js
 */
class FileWriter
{
    /**
     * [sample] These doc comment become API document.
     *
     * @param filename File name
     * @return success?
     */
    function write(filename : string) : boolean
    {
        // Writing file by using node.js module
        node.fs.writeFileSync(filename, "Hello World", "utf8");
        return node.fs.existsSync(filename);
    }
}

class _Main {
    static function main(argv : string[]) : void
    {
        console.log("Hello World");

        var parser = new BasicParser('h(help)', argv);
        var help = false;
        var filenames = [] : string[];

        var opt = parser.getopt();
        while (opt)
        {
            switch (opt.option)
            {
            case 'h':
                help = true;
                break;
            default:
                filenames.push(opt.option);
            }
            opt = parser.getopt();
        }
        if (help)
        {
            console.log("Write help message here");
        }
        else
        {
            for (var i = 0; i < filenames.length; i++)
            {
                var writer = new FileWriter();
                writer.write(filenames[i]);
            }
        }
    }
}
