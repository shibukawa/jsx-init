/**
 * Sencha Touch/Ext.js bootstrap code
 * src/app.jsx should import this file.
 *
 * Created by Yoshiki Shibukawa (MIT License)
 */

native class ExtLauncher {} = '''
function () {};
// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src'
});
//</debug>

Ext.defer(function () {
    var module = JSX.require('src/app.jsx')._Main;
    if (!module)
    {
        throw new Error("Can't src/app.jsx. This boot script assumes it has src/app.jsx.");
    }

    if (!module.main)
    {
        throw new Error("Can't find main function in src/app.jsx");
    }

    var config = {};
    for (var key in module.config)
    {
        if (module.config.hasOwnProperty(key))
        {
            config[key] = module.config[key];
        }
    }

    config.launch = module.main;

    if (module.onUpdate$)
    {
        config.onUpdate = module.onUpdate$;
    }

    Ext.application(config);
}, 10);
''';
