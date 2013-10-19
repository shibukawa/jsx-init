import "console.jsx";
import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "nodejs/child_process.jsx";
import "setting.jsx";
import "prompt.jsx";
import "uuid.jsx";
import "getopt.jsx";


class JSXInit
{
    var currentDir : string;
    var dirName : string;

    function constructor()
    {
    }

    function userDir() : string
    {
        var win32 = process.platform == 'win32';
        return process.env[win32 ? 'USERPROFILE' : 'HOME'];
    }

    function defaultSetting() : Setting
    {
        var userDir = this.userDir();
        var setting = new Setting(userDir);
        return setting;
    }

    function checkOption(argv : string[]) : boolean
    {

        var parser = new BasicParser('h(help)', argv);

        var help = false;

        var opt = parser.getopt();
        while (opt)
        {
            if (opt.option == 'h')
            {
                help = true;
            }
            opt = parser.getopt();
        }
        if (help)
        {
            var setting = this.defaultSetting();

            console.log("jsx-init: version " + setting.version);
            console.log("    By Yoshiki Shibukawa (https://github.com/shibukawa/jsx-init)");
            console.log('''
$ jsx-init [options]

options:
  -h, --help             : show this message

This program generates JSX project template.
The following step is a recommendation step:

1. Cteate new repository on Github or Bitbucket.

2. Create folder that has folder name that is as same as a planned package name.

   $ mkdir awesome.jsx

3. Move into the folder.

   $ cd awesome.jsx

4. Launch jsx-init without option.

   $ jsx-init

jsx-init asks you to create project template like project name, repository URL,
license type and so on.

There are three types of questions:

1. Open Question: Names, URL, and so on. The string in [ ] block is default.
2. Selection: Select by using number. It is used for project type or license.
3. Yes/No: y/Y/yes/Yes become yes.

Supported Template:
''');
            console.log(setting.getTemplateDescriptions().join('\n'));
            console.log('\nEnjoy!');
            return false;
        }
        return true;
    }

    function start() : void
    {
        var setting = this.defaultSetting();

        console.log("jsx-init: version " + setting.version);
        console.log("    By Yoshiki Shibukawa (https://github.com/shibukawa/jsx-init)");

        var prompt = new Prompt(setting.defaultJson);
        prompt.addPersistentKeys(['author', 'mail', 'githubAccount', 'bitbucketAccount']);

        prompt.add(new OpenQuestion('OriginalName', false, 'Project name', function (value : string) {
            prompt.setDefault('name', this.normalizeName(value));
            prompt.setDefault('Name', this.symbolName(value));
        }));
        prompt.add(new OpenQuestion('name', false, 'npm Package name'));
        prompt.add(new OpenQuestion('description', false, 'Short description', "This is an awesome project to make everyone happy!"));
        prompt.add(new OpenQuestion('version', false, 'Version', '0.1.0'));
        prompt.add(setting.getTemplateQuestion());
        prompt.start(function (finish : boolean) : void {
            if (finish)
            {
                var name = prompt.get('name') as string;
                if (name.slice(-4) == '.jsx')
                {
                    prompt.setDefault('filebasename', name.slice(0, -4));
                }
                else
                {
                    prompt.setDefault('filebasename', name);
                }
                var templateId = prompt.get('template') as int;
                prompt.add(setting.getExtraQuestions(templateId));
                prompt.add(setting.getLicenseQuestion(templateId));
                prompt.add(new OpenQuestion('author', false, 'Author name', function (value : string) {
                    setting.author = value;
                    prompt.setDefault('mail', this.normalizeName(value) + '@gmail.com');
                    var githubAccount = prompt.get('githubAccount');
                    var bitbucketAccount = prompt.get('bitbucketAccount');
                    if (githubAccount)
                    {
                        prompt.set('repository', 'git://github.com/' + githubAccount as string + '/' + name + '.git');
                    }
                    else if (bitbucketAccount)
                    {
                        prompt.set('repository', 'git@bitbucket.org:' + bitbucketAccount as string + '/' + name + '.git');
                    }
                    else
                    {
                        prompt.set('repository', 'git://github.com/' + this.normalizeName(value) + '/' + name + '.git');
                    }
                }));
                prompt.add(new OpenQuestion('mail', true, "Author's mail address", function (value : string) {
                    setting.mail = value;
                }));
                prompt.add(new OpenQuestion('repository', true, "Repository URI", function (value : string) {
                    var bitbucket = value.match(new RegExp('((https://)|(ssh://hg@)|(git@))bitbucket\\.org[:/]([-\\._a-zA-Z0-9]+)/([-\\._a-zA-Z0-9]+?)(\\.git)?$'));
                    var bitbucket_git_https = value.match(new RegExp('https://([\\.-_a-zA-Z0-9]+)@bitbucket\\.org/([-\\._a-zA-Z0-9]+)/([-\\._a-zA-Z0-9]+?)\\.git$'));
                    var github = value.match(new RegExp('((https://)|(git@)|(git://))github\.com[:/]([-\\._a-zA-Z0-9]+)/([-\\._a-zA-Z0-9]+?)(\\.git)?$'));
                    var issuetracker = '';
                    var homepage = '';
                    prompt.setDefault('repositorytype', 'git');
                    if (bitbucket)
                    {
                        setting.bitbucketAccount = bitbucket[5];
                        homepage = 'https://bitbucket.org/' + bitbucket[5] + '/' + bitbucket[6];
                        issuetracker = homepage + "/issues?status=new&status=open";
                        if (value.indexOf('git') == -1)
                        {
                            prompt.setDefault('repositorytype', 'hg');
                        }
                    }
                    else if (bitbucket_git_https)
                    {
                        var matched = bitbucket_git_https;
                        setting.bitbucketAccount = matched[1];
                        homepage = 'https://bitbucket.org/' + matched[1] + '/' + matched[3];
                        if (homepage.slice(-4) == '.git')
                        {
                            homepage = homepage.slice(0, -4);
                        }
                        issuetracker = homepage + "/issues?status=new&status=open";
                    }
                    else if (github)
                    {
                        setting.githubAccount = github[5];
                        homepage = 'https://github.com/' + github[5] + '/' + github[6];
                        if (homepage.slice(-4) == '.git')
                        {
                            homepage = homepage.slice(0, -4);
                        }
                        issuetracker = homepage + "/issues";
                    }
                    if (homepage)
                    {
                        prompt.setDefault('homepage', homepage);
                    }
                    if (issuetracker)
                    {
                        prompt.setDefault('issuetracker', issuetracker);
                    }
                }));
                prompt.add(new OpenQuestion('homepage', true, "Where is the project's web page?"));
                prompt.add(new OpenQuestion('issuetracker', true, "Where is the project's issue tracker page?"));
                prompt.add(new YesNo('travis', "Do you want to have travis.ci setting file?", 'yes'));
                prompt.start(function (finish : boolean) : void {
                    if (finish)
                    {
                        this.write(setting, prompt.getResult(), prompt.getPersistentData());
                    }
                });
            }
        });
    }

    function write(setting : Setting, result : Map.<variant>, persistentData : Map.<string>) : void
    {
        console.log('');
        var template = setting.templates[result['template'] as int];
        var license = setting.getLicensePath(result['template'] as int, result['license'] as int);
        var date = new Date();
        result['year'] = date.getFullYear();
        result['month'] = date.getMonth() + 1;
        result['day'] = date.getDate();
        result['licensename'] = path.basename(license).slice(0, -3);
        result['UUID'] = UUID.generate();
        template.generate(result, license);
        setting.save(persistentData);
        console.log('\nfinished!');
        console.log(
'''
Congratulations! Your project folder is prepared. Let's start hacking!
Before development, launch npm to install Grunt build tool.

$ npm install

You can use following command:

* Build
  $ grunt build

* Automatic build
  $ grunt watch:build

* Run test
  $ grunt test

* Automatic test
  $ grunt watch:test

* Generate document
  $ grunt build

Enjoy JSX!
''');
    }

    function normalizeName(name : string) : string
    {
        return name.toLowerCase().replace(/[ &*^%$#@!~`+=\[\]\\{}|;':",\/<>?]/g, '-');
    }

    function symbolName(name : string) : string
    {
        if (name.slice(-4) == '.jsx')
        {
            name = name.slice(0, -4);
        }
        return name.replace(/[ \.&*^%$#@!~`+=\[\]\\{}|;':",\/<>?]/g, '_');
    }
}

class _Main
{
    static function main (argv : string[]) : void
    {
        var init = new JSXInit();
        if (init.checkOption(argv))
        {
            init.start();
        }
    }
}
