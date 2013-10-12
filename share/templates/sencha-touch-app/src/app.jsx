/**
 * {{& OrigianlName }}
 *
 * {{& description }}
 *
 * [sample] This comment is document for class. You can use some HTML tags.
 *
 * @author {{& author }}
 *
 * @see {{& homepage }}
 *
 * License: {{& licensename }}
 */

// JSX standard library
import "js/web.jsx";
// Ext.js / Sencha Touch
import "ext-boot.jsx";
import "sencha-touch.jsx";
// Application Code
import "./view/main.jsx";


class _Main
{
    static const config = {
        name: '{{& Name }}',
        icon: {
            '57': 'resources/icons/Icon.png',
            '72': 'resources/icons/Icon~ipad.png',
            '114': 'resources/icons/Icon@2x.png',
            '144': 'resources/icons/Icon~ipad@2x.png'
        },
        isIconPrecomposed: true,
        startupImage: {
            '320x460': 'resources/startup/320x460.jpg',
            '640x920': 'resources/startup/640x920.png',
            '768x1004': 'resources/startup/768x1004.png',
            '748x1024': 'resources/startup/748x1024.png',
            '1536x2008': 'resources/startup/1536x2008.png',
            '1496x2048': 'resources/startup/1496x2048.png'
        },
        requires: [
            'Ext.MessageBox'
        ],
        views: [] : string[]
    };

    static function main (argv : string[]) : void
    {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
        // Initialize the main view
        var view = new MainView();
        Ext.Viewport.add(view as Ext.Component);
    }

    static function onUpdate () : void
    {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            (buttonId, value, opt) -> {
                if (buttonId == 'yes') {
                    dom.window.location.reload();
                }
            }
        );
    }
}

