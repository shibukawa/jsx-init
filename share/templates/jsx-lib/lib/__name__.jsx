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

class {{& Name }}
{
    var message : string;

    /**
     * Constructs {{& Name }} object.
     */
    function constructor()
    {
    }

    /**
     * [sample] Update message.
     *
     * @param message [sample] Message string to store.
     */
    function setMessage(message : string) : void
    {
        this.message = message;
    }

    /**
     * [sample] Returns greeting message.
     *
     * @return [sample] greeting message.
     */
    function greeting() : string
    {
        return this.message;
    }
}
