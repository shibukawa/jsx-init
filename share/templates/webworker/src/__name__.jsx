import "js/web.jsx";
import "webworker.jsx";

class _Main
{
    static var counter = 0;
    static function main(argv : string[]) : void
    {
        // called when loading.
    }

    static function onmessage (event : MessageEvent) : void
    {
        switch (event.data as string)
        {
        case "start":
            self.setInterval(() -> {
                _Main.counter++;
                self.postMessage(_Main.counter);
            }, 1000);
            break;

        case "reset":
            _Main.counter = 0;
            break;
        }
    }
}
