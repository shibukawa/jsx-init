import "js/web.jsx";
import "timer.jsx";
import "console.jsx";

class _Main
{
    static function main (argv : string[]) : void
    {
        var worker = new Worker('src/sample.js');

        worker.onmessage = (event)-> {
            dom.document.write((event as MessageEvent).data as string + '<br/>');
        };

        worker.postMessage("start");

        Timer.setInterval(()->{
            console.log("reset");
            worker.postMessage("reset");
        }, 10000);
    }
}
