import "console.jsx";
import "nodejs/nodejs.jsx";
import "nodejs/fs.jsx";
import "nodejs/path.jsx";
import "nodejs/child_process.jsx";
import "setting.jsx";
import "prompt.jsx";


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

    function start() : void
    {
        var setting = this.defaultSetting();
        var prompt = new Prompt();
        prompt.add(new OpenQuestion('Name', false, 'Project name', setting.name, function (value : string) {
            prompt.setDefault('name', this.normalizeName(value));
        }));
        prompt.add(new OpenQuestion('name', false, 'npm Package name'));
        prompt.add(new OpenQuestion('description', false, 'Short description', "This is an awesome project to make everyone happy!"));
        prompt.add(new OpenQuestion('version', false, 'Version', '0.1.0'));
        prompt.add(setting.getTemplateQuestion());
        prompt.start(function (finish : boolean) : void {
            if (finish)
            {
                var name = prompt.get('name') as string;
                prompt.add(setting.getLicenseQuestion(prompt.get('template') as int));
                prompt.add(new OpenQuestion('author', false, 'Author name', setting.author, function (value : string) {
                    setting.author = value;
                    if (setting.mail)
                    {
                        prompt.setDefault('mail', setting.mail);
                    }
                    else
                    {
                        prompt.setDefault('mail', this.normalizeName(value) + '@gmail.com');
                    }
                    if (setting.githubAccount)
                    {
                        prompt.setDefault('repository', 'git@github.com:' + setting.githubAccount + '/' + name + '.git');
                    }
                    else if (setting.bitbucketAccount)
                    {
                        prompt.setDefault('repository', 'git@bitbucket.org:' + setting.bitbucketAccount + '/' + name + '.git');
                    }
                    else
                    {
                        prompt.setDefault('repository', 'git@github.com:' + this.normalizeName(value) + '/' + name + '.git');
                    }
                }));
                prompt.add(new OpenQuestion('mail', true, "Author's mail address", function (value : string) {
                    setting.mail = value;
                }));
                prompt.add(new OpenQuestion('repository', true, "Repository URI", function (value : string) {
                    var bitbucket = value.match(new RegExp('((https://)|(ssh://hg@)|(git@))bitbucket\.org[:/]([-_a-zA-Z0-9]+)/([-_a-zA-Z0-9]+)(\.git)?'));
                    var bitbucket_git_https = value.match(new RegExp('https://([-_a-zA-Z0-9]+)@bitbucket\.org/([-_a-zA-Z0-9]+)/([-_a-zA-Z0-9]+)\.git'));
                    var github = value.match(new RegExp('((https://)|(git@)|(git://))github\.com[:/]([-_a-zA-Z0-9]+)/([-_a-zA-Z0-9]+)(\.git)?'));
                    var issuetracker = '';
                    var homepage = '';
                    prompt.setDefault('repositorytype', 'git');
                    if (bitbucket)
                    {
                        setting.bitbucketAccount = bitbucket[5];
                        homepage = 'https://bitbucket.org/' + bitbucket[5] + '/' + bitbucket[6];
                        issuetracker = homepage + "/issues?status=new&status=open";
                        if (value.indexOf('git@') == -1)
                        {
                            prompt.setDefault('repositorytype', 'hg');
                        }
                    }
                    else if (bitbucket_git_https)
                    {
                        var matched = bitbucket_git_https;
                        setting.bitbucketAccount = matched[1];
                        homepage = 'https://bitbucket.org/' + matched[1] + '/' + matched[3];
                        issuetracker = homepage + "/issues?status=new&status=open";
                    }
                    else if (github)
                    {
                        setting.githubAccount = github[5];
                        homepage = 'https://github.org/' + github[5] + '/' + github[6];
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
                        this.write(setting, prompt.getResult());
                    }
                });
            }
        });
    }

    function write(setting : Setting, result : Map.<variant>) : void
    {
        console.log('');
        var template = setting.templates[result['template'] as int];
        var license = setting.getLicensePath(result['template'] as int, result['license'] as int);
        var date = new Date();
        result['year'] = date.getFullYear();
        result['licensename'] = path.basename(license).slice(0, -3);
        template.generate(result, license);
        setting.save();
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
        return name.toLowerCase().replace(/[ &*^%$#@!~`+=[]\{}|;':",.\/<>?]/g, '-');
    }
}

class _Main
{
    static function main (argv : string[]) : void
    {
        var init = new JSXInit();
        init.start();
    }
}
