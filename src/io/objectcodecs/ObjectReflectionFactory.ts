export class ObjectReflectionFactory
{
	private static reflections : Dictionary = new Dictionary();

	public static reflection( component : Object ) : ObjectReflection
	{
		var type : Class = component.constructor as Class;
		if( !reflections[ type ] )
		{
			reflections[ type ] = new ObjectReflection( component );
		}
		return reflections[ type ];
	}
}
