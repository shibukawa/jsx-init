import "console.jsx";
import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "nodejs/events.jsx";
import "nodejs/readline.jsx";

abstract class Question
{
    var _key : string;
    var _defaultValue : string;
    var _firstMessage : string;
    var _question : string;
    var _persistent : boolean;

    abstract function _validate(value : string, defaultValue : string) : boolean;
    abstract function _setResult(json : variant) : void;

    function constructor ()
    {
        this._firstMessage = '';
    }

    function setPersistent(flag : boolean) : void
    {
        this._persistent = flag;
    }

    function completer () : Nullable.<(string) -> variant[]>
    {
        return null;
    }

    function ask(json : Map.<variant>, finish : (boolean) -> void) : void
    {
        console.log(this._firstMessage);
        var option = {
            input: process.stdin,
            output: process.stdout
        } : Map.<variant>;
        var completer = this.completer();
        if (completer)
        {
            option['completer'] = completer;
        }
        var rl = Readline.createInterface(option);
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
        rl.setPrompt(question, question.length);
        rl.on('close', () -> {
            if (!received)
            {
                console.log("interrupted");
                finish(false);
            }
        });
        rl.on('line', (line) -> {
            if (this._validate(line as string, defaultValue))
            {
                received = true;
                this._setResult(json);
                rl.close();
                finish(true);
            }
            else
            {
                rl.prompt();
            }
        });
        rl.prompt();
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

    function constructor(key : string, allowEmpty : boolean, question : string, defaultValue : string = '', cb : (string) -> void = (string) -> {})
    {
        this._key = key;
        this._question = question;
        this._defaultValue = defaultValue;
        this._pattern = null;
        this._allowEmpty = allowEmpty;
        this._cb = cb;
    }

    function constructor(key : string, allowEmpty : boolean, question : string, cb : (string) -> void)
    {
        this._key = key;
        this._question = question;
        this._defaultValue = '';
        this._pattern = null;
        this._allowEmpty = allowEmpty;
        this._cb = cb;
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

class PathQuestion extends OpenQuestion
{
    function constructor(key : string, allowEmpty : boolean, question : string, defaultValue : string = '', cb : (string) -> void = (string) -> {})
    {
        super(key, allowEmpty, question, defaultValue, cb);
    }

    function constructor(key : string, allowEmpty : boolean, question : string, cb : (string) -> void)
    {
        super(key, allowEmpty, question, cb);
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
        else if (value.slice(0, 2) == '~/')
        {
            value = path.join(this.userDir(), value.slice(2));
        }
        if (value && !fs.existsSync(value))
        {
            console.log("Filepath '" + value + "' does not exist.");
        }
        else if (value || this._allowEmpty)
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

    function userDir() : string
    {
        var win32 = process.platform == 'win32';
        return process.env[win32 ? 'USERPROFILE' : 'HOME'];
    }

    override function completer () : Nullable.<(string) -> variant[]>
    {
        return (line: string) -> {
            var head = line.slice(0, 1);
            var tail = line;
            var base : string;
            if (head == '~')
            {
                head = '~/';
                base = this.userDir();
                tail = '.' + line.slice(1);
            }
            else if (head == '/')
            {
                head = '/';
                base = '';
            }
            else
            {
                head = './';
                base = process.cwd();
            }
            var absInputPath = path.resolve(base, tail);
            var result = [] : string[];
            var checked = false;
            if (fs.existsSync(absInputPath))
            {
                var stats = fs.statSync(absInputPath);
                if (stats.isDirectory())
                {
                    result = this.getCompleteEntries(absInputPath, '');
                    checked = true;
                }
            }
            if (!checked)
            {
                var dir = path.dirname(absInputPath);
                var basename = path.basename(absInputPath);
                if (fs.existsSync(dir))
                {
                    result = this.getCompleteEntries(dir, basename);
                }
            }
            for (var i = 0; i < result.length; i++)
            {
                var relative = path.relative(base, result[i]);
                result[i] = path.join(head, relative);
            }
            return [result, line];
        };
    }

    function getCompleteEntries (dir : string, basename : string) : string[]
    {
        var result = [] : string[];
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++)
        {
            if (files[i].indexOf(basename) == 0)
            {
                var filepath = path.join(dir, files[i]);
                var stats = fs.statSync(filepath);
                if (stats.isDirectory())
                {
                    result.push(filepath + '/');
                }
                else
                {
                    result.push(filepath);
                }
            }
        }
        return result;
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
    var _persistentKeys : string[];

    function constructor (defaultValues : Map.<string> = {})
    {
        this._json = {} : Map.<variant>;
        this._questions = [] : Question[];
        this._persistentKeys = [] : string[];
        for (var key in defaultValues)
        {
            if (defaultValues.hasOwnProperty(key))
            {
                this.set(key, defaultValues[key]);
            }
        }
    }

    function get(key : string) : variant
    {
        return this._json[key];
    }

    function set(key : string, value : string) : void
    {
        this._json[key] = value;
    }

    function addPersistentKey(key : string) : void
    {
        this._persistentKeys.push(key);
    }

    function addPersistentKeys(keys : string[]) : void
    {
        this._persistentKeys = this._persistentKeys.concat(keys);
    }

    function setDefault(key : string, value : string) : void
    {
        if (!this._json[key])
        {
            this._json[key] = value;
        }
    }

    function getResult() : Map.<variant>
    {
        return this._json;
    }

    function add (question : Question) : void
    {
        this._questions.push(question);
        if (question._persistent)
        {
            this._persistentKeys.push(question._key);
        }
    }

    function add (questions : Question[]) : void
    {
        for (var i = 0; i < questions.length; i++)
        {
            this.add(questions[i]);
        }
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

    function getPersistentData() : Map.<string>
    {
        var result = {} : Map.<string>;
        for (var i = 0; i < this._persistentKeys.length; i++)
        {
            var key = this._persistentKeys[i];
            if (this._json[key])
            {
                result[key] = this._json[key] as string;
            }
        }
        return result;
    }
}
