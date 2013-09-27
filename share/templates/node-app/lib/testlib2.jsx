class TestLib2
{
    var message : string;

    function constructor()
    {
    }

    function setMessage(message : string) : void
    {
        this.message = message;
    }

    function greeting() : string
    {
        return this.message;
    }
}
