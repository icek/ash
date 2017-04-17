import { assert } from 'chai';
import { ClassMap } from "../src/ash";

describe( 'ClassMap tests', () =>
{
    it( 'string key, string value', () =>
    {
        let m = new ClassMap<string, string>();
        m.set("aaa", "bbb");

        assert.equal( m.get("aaa"), "bbb");
    } );

    it( 'class key, string value', () =>
    {
        let m = new ClassMap<TC, string>();
        let c = new TC();
        m.set(c, "aaa");

        assert.equal( m.get(c), "aaa");
    } );

    it( 'class key, string value 2', () =>
    {
        let m = new ClassMap<TC, string>();
        let c = new TC();
        let d = new TC();
        m.set(c, "aaa");
        m.set(d, "bbb");

        assert.equal( m.get(d), "bbb");
    } );

    it( 'type key, string value', () =>
    {
        let m = new ClassMap<{ new():any }, string>();
        m.set(TC, "aaa");

        assert.equal( m.get(TC), "aaa");
    } );

    it( 'type key, string value 2', () =>
    {
        let m = new ClassMap<{ new():any }, string>();
        m.set(TC, "aaa");
        m.set(TC2, "bbb");

        assert.equal( m.get(TC2), "bbb");
        assert.equal( m.get(TC), "aaa");
    } );

    it( 'type key, object value', () =>
    {
        let m = new ClassMap<{ new():any }, any>();
        let a = new TC();
        let b = new TC2();
        m.set(TC, a);
        m.set(TC2, b);

        assert.equal( m.get(TC2), b);
        assert.equal( m.get(TC), a);
    } );

    it( 'type key, object value 2', () =>
    {
        let m = new ClassMap<{ new():any }, any>();
        let a = new TC();
        let b = new TC2();
        m.set(TC, a);
        m.set( b.constructor.prototype.constructor, b);

        assert.equal( m.get(TC2), b);
        assert.equal( m.get(TC), a);
    } );

} );

class TC
{
    public x:number = 0;
    public y:number = 0;
}

class TC2
{
    public x:number = 0;
    public y:number = 0;
}
