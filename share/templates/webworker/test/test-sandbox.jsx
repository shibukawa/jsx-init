import "test-case.jsx";
import "sandbox.jsx";
import "js/nodejs.jsx";


class _Test extends TestCase
{
    override function setUp() : void
    {
        if (node.fs.existsSync('test.txt'))
        {
            node.fs.unlinkSync('test.txt');
        }
    }

    override function tearDown() : void
    {
        if (node.fs.existsSync('test.txt'))
        {
            node.fs.unlinkSync('test.txt');
        }
    }

    function test_filewriter() : void
    {
        var writer = new FileWriter();
        writer.write('test.txt');
        this.expect(node.fs.existsSync('test.txt')).toBe(true);
    }
}
