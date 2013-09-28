import "test-case.jsx";
import "{{& filebasename }}.jsx";

class _Test extends TestCase
{
    function test_greeting() : void
    {
        var obj = new {{& basefilename }}();
        obj.setMessage("Hello World");
        this.expect(obj.greeting()).toBe("Hello World");
    }
}
