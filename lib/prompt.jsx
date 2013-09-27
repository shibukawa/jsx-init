import "console.jsx";
import "nodejs/nodejs.jsx";
import "nodejs/events.jsx";
import "nodejs/readline.jsx";

abstract class Question {
    var _key : string;
    var _defaultValue : string;
    var _firstMessage : string;
    var _question : string;

    abstract function _validate(value : string, defaultValue : string) : boolean;
    abstract function _setResult(json : variant) : void;

    function constructor ()
    {
        this._firstMessage = '';
    }

    function ask(json : Map.<variant>, finish : (boolean) -> void) : void
    {
        console.log(this._firstMessage);
        var rl = Readline.createInterface({
              input: process.stdin,
              output: process.stdout
        } : Map.<variant>);
        var defaultValue = this.getDefaultValue(json);
        if (defaultValue)
        {
            var question = this._question + ' [' + defaultValue + '] >>> ';
        }
        else
        {
            var question = this._question + ' >>> ';
        }
        var received = false;
        rl.on('close', function () : void {
            if (!received)
            {
                console.log("interrupted");
                finish(false);
            }
        });
        function ask () : void
        {
            rl.question(question, function (value : string) : void {
                if (this._validate(value, defaultValue))
                {
                    received = true;
                    this._setResult(json);
                    rl.close();
                    finish(true);
                }
                else
                {
                    ask();
                }
            });
        }
        ask();
    }

    function getDefaultValue(json : Map.<variant>) : string
    {
        var defaultValue = this._defaultValue;
        if (this._key && json.hasOwnProperty(this._key))
        {
            defaultValue = json[this._key] as string;
        }
        return defaultValue;
    }

    function setValue(json : variant, value : string) : void
    {
        if (this._key)
        {
            var keys = this._key.split('.');
            while (keys.length > 1)
            {
                var key = keys.shift();
                if (json[key] == null)
                {
                    json[key] = {} : variant;
                }
                json = json[key];
            }
            json[keys[0]] = value;
        }
    }
}

class OpenQuestion extends Question
{
    var _pattern : Nullable.<RegExp>;
    var _allowEmpty : boolean;
    var _result : string;
    var _cb : (string) -> void;

    function constructor(key : string, allowEmpty : boolean, question : string, defaultValue : string, cb : (string) -> void) {
        this._key = key;
        this._question = question;
        this._defaultValue = defaultValue;
        this._pattern = null;
        this._allowEmpty = allowEmpty;
        this._cb = cb;
    }

    function constructor(key : string, allowEmpty : boolean, question : string, cb : (string) -> void) {
        this._key = key;
        this._question = question;
        this._defaultValue = '';
        this._pattern = null;
        this._allowEmpty = allowEmpty;
        this._cb = cb;
    }

    function constructor(key : string, allowEmpty : boolean, question : string, defaultValue : string = '') {
        this._key = key;
        this._question = question;
        this._defaultValue = defaultValue;
        this._pattern = null;
        this._allowEmpty = allowEmpty;
    }

    function setPattern(pattern : RegExp) : void
    {
        this._pattern = pattern;
    }

    override function _setResult(json : variant) : void
    {
        json[this._key] = this._result;
    }

    override function _validate(value : string, defaultValue : string) : boolean
    {
        if (value == '')
        {
            value = defaultValue;
        }
        if (value || this._allowEmpty)
        {
            this._result = value;
            if (this._cb)
            {
                this._cb(value);
            }
            return true;
        }
        return false;
    }
}

class Selection extends Question
{
    var _first : string;
    var _selections : int;
    var _result : int;

    function constructor(key : string, question : string, selectionList : string, selections : int) {
        this._key = key;
        this._question = question;
        this._firstMessage = '\n' + selectionList + '\n';
        this._selections = selections;
        this._defaultValue = '';
    }

    override function _setResult(json : variant) : void
    {
        json[this._key] = this._result;
    }

    override function _validate(value : string, defaultValue : string) : boolean
    {
        if (value == '')
        {
            return false;
        }
        var select = value as int;
        if (0 < select && select <= this._selections)
        {
            this._result = select - 1;
            return true;
        }
        return false;
    }
}

class YesNo extends Question
{
    var _result : boolean;

    function constructor(key : string, question : string, defaultValue : string) {
        this._key = key;
        this._question = question;
        this._defaultValue = defaultValue;
    }

    override function _setResult(json : variant) : void
    {
        json[this._key] = this._result;
    }

    override function _validate(value : string, defaultValue : string) : boolean
    {
        if (value == '')
        {
            value = defaultValue;
        }
        if (value.match(/^y(es)?$/i))
        {
            this._result = true;
            return true;
        }
        else if (value.match(/^n(o)?$/i))
        {
            this._result = false;
            return true;
        }
        return false;
    }
}


class Prompt extends EventEmitter
{
    var _questions : Question[];
    var _index : int;
    var _json : Map.<variant>;

    function constructor ()
    {
        this._json = {} : Map.<variant>;
        this._questions = [] : Question[];
    }

    function get(key : string) : variant
    {
        return this._json[key];
    }

    function setDefault(key : string, value : string) : void
    {
        this._json[key] = value;
    }

    function getResult() : Map.<variant>
    {
        return this._json;
    }

    function add (question : Question) : void
    {
        this._questions.push(question);
    }

    function start (cb : (boolean) -> void) : void
    {
        function next(success : boolean) : void {
            if (!success)
            {
                cb(false);
            }
            else if (this._questions.length > 0)
            {
                var question = this._questions.shift();
                question.ask(this._json, next);
            }
            else
            {
                cb(true);
            }
        }
        next(true);
    }
}
