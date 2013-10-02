import "console.jsx";
import "{{& filebasename }}.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        var obj = new {{& Name }}();
        obj.setMessage("Hello World");
        console.log(obj.greeting());
    }
}
