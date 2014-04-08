/**
 * {{& Name }}
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

import "console.jsx";
import "js/nodejs.jsx";
import "js/web.jsx";
import "node-webkit.jsx";

/**
 * Main code of node-webkit application.
 * You can use node-webkit API and Web API, node.js API together.
 */
class _Main {
    static function main(argv : string[]) : void
    {
        var menu = new nw.gui.Menu();

        // Add some items
        menu.append(new nw.gui.MenuItem({ label: 'Item A' }));
        menu.append(new nw.gui.MenuItem({ label: 'Item B' }));
        menu.append(new nw.gui.MenuItem({ type: 'separator' }));
        menu.append(new nw.gui.MenuItem({ label: 'Item C' }));

        // Remove one item
        menu.removeAt(1);

        // Popup as context menu
        menu.popup(400, 300);
    }
}
