/**
 * {{& OriginalName }}
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

        var writer = new FileWriter();
        writer.write('test.txt');
    }
}
