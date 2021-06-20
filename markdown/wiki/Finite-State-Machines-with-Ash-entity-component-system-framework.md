#### IMPORTANT! [This article was originally written by Richard Lord.](https://www.richardlord.net/blog/ecs/finite-state-machines-with-ash.html)

#### Version below contains examples updated to typescript syntax.

_Posted on 05 December 2012_

Finite state machines are one of the staple constructs in game development.
During the course of a game, game objects may pass through many states and
managing those states effectively is important.

The difficulty with finite state machines in an entity system framework like Ash
can be summed up in one sentence - the state pattern doesn’t work with an entity
system framework. Entity system frameworks use a data-oriented paradigm in which
game objects are not self-contained OOP objects. So you can’t use the state
pattern, or any variation of it. All the data is in the components, all the
logic is in the systems.

If your states are few and simple it is possible to use a good old fashioned
switch statement inside a system, with the data for all the states in one or
more components that are used by that system, but I wouldn’t usually recommend
that.

When creating Stick Tennis I was faced with the problem of how to manage states
as the two main entities in the game are the two players, and they go through a
number of states as they...

- prepare to serve
- swing arm to toss the ball
- release the ball
- swing the racquet
- hit the ball
- follow through
- run to a good position
- react to the opponent hitting the ball
- run to intercept the ball
- swing the racquet
- hit the ball
- follow through
- run to a good position
- react to winning the point
- ...etc

Stick Tennis is a complex example, and I can’t show you the source code, so
instead I’ll use something a little simpler, with source code.

## An example

Lets consider a guard character in a game. This character patrols along a path,
keeping watch. If they spot an enemy, they attack him/her.

In a traditional object-oriented state machine we might have a class for each
state

```typescript
class PatrolState {
  private guard:Character;
  private path:Point[];

  public PatrolState(guard:Character, path:Point[]) {
    this.guard = guard;
    this.path = path;
  }

  public update(time:number):void {
    moveAlongPath(time);
    const enemy:Character = lookForEnemies();
    if (enemy) {
      guard.changeState(new AttackState(guard, enemy));
    }
  }
}
```

```typescript
class AttackState {
  private guard:Character;
  private enemy:Character;

  public constructor(guard:Character, enemy:Character) {
    this.guard = guard;
    this.enemy = enemy;
  }

  public update(time:number):void {
    guard.attack(enemy);
    if (enemy.isDead) {
      guard.changeState(new PatrolState(guard, PatrolPathFactory.getPath(guard.id)));
    }
  }
}
```

In a entity system architecture we have to take a slightly different approach,
but the core principle of the state pattern, to split the state machine across
multiple classes, one for each state, can still be applied. To implement the
state machine in an entity framework we will use one System per state.

```typescript
class PatrolSystem extends ListIteratingSystem {
  public constructor() {
    super(PatrolNode, updateNode);
  }

  private updateNode(node:PatrolNode, time:number):void {
    moveAlongPath(node);
    const enemy:Enemy = lookForEnemies(node);
    if (enemy) {
      node.entity.remove(Patrol);
      const attack:Attack = new Attack();
      attack.enemy = enemy;
      node.entity.add(attack);
    }
  }
}
```

```typescript
class AttackSystem extends ListIteratingSystem {
  public constructor() {
    super(AttackNode, updateNode);
  }

  private updateNode(node:PatrolNode, time:number):void {
    attack(node.entity, node.attack.enemy);
    if (node.attack.enemy.get(Health).energy == 0) {
      node.entity.remove(Attack);
      const patrol:Patrol = new Patrol();
      patrol.path = PatrolPathFactory.getPath(node.entity.name);
      node.entity.add(patrol);
    }
  }
}
```

The guard will be processed by the PatrolSystem if he has a Patrol component,
and he will be processed by the AttackSystem if he has an Attack component. By
adding/removing these components from the guard we change his state.

The components and nodes look like this...

```typescript
class Patrol {
  public path:Point[];
}
```

```typescript
class Attack {
  public enemy:Entity;
}
```

```typescript
class Position {
  public point:Point;
}
```

```typescript
class Health {
  public energy:number;
}
```

```typescript
class PatrolNode extends Node {
  public patrol:Patrol;
  public position:Position;
}
```

```typescript
class AttackNode extends Node {
  public attack:Attack;
}
```

So, by changing the components of the entity, we change the entities state and
thus change the systems that process the entity.

Another example Here’s another, more complex example using the Asteroids example
game that I use to illustrate how Ash works. I’ve add an additional state to the
spaceship for when it’s shot. Rather than simply removing the spaceship when it
is shot, I show a short animation of it breaking up. While doing this, the user
won’t be able to move it and the spaceship won’t react to collisions with other
objects.

The two states require the following

While the ship is alive -

It looks like a spaceship The user can move it The user can fire its gun It
collides with asteroids When the ship is dead -

It looks like bits of a spaceship floating in space The user cannot move it The
user cannot fire its gun It doesn’t collide with asteroids After a fixed time it
is removed from the game The relevant piece of code, where the spaceship dies,
is in the CollisionSystem. Without the second state it would look like this

```typescript
for (spaceship = spaceships.head; spaceship; spaceship = spaceship.next) {
  for (asteroid = asteroids.head; asteroid; asteroid = asteroid.next) {
    if (Point.distance(asteroid.position.position, spaceship.position.position)
      <= asteroid.position.collisionRadius + spaceship.position.collisionRadius) {
      creator.destroyEntity(spaceship.entity);
      break;
    }
  }
}
```

The code tests whether the ship is colliding with an asteroid, and if it is it
removes the ship. Elsewhere, the GameManager system handles the situation where
there is no spaceship and creates another one, if any are left, or ends the
game. Instead of destroying the spaceship, we need to change its state. So, lets
try this...

We can prevent the user controlling the spaceship by simply removing the
MotionControls and GunControls components. We might as well remove the Motion
and Gun components while we’re at it since they're of no use without the
controls. So we replace the code above with

```typescript
for (spaceship = spaceships.head; spaceship; spaceship = spaceship.next) {
  for (asteroid = asteroids.head; asteroid; asteroid = asteroid.next) {
    if (Point.distance(asteroid.position.position, spaceship.position.position)
      <= asteroid.position.collisionRadius + spaceship.position.collisionRadius) {
      spaceship.entity.remove(MotionControls);
      spaceship.entity.remove(Motion);
      spaceship.entity.remove(GunControls);
      spaceship.entity.remove(Gun);
      break;
    }
  }
}
```

Next, we need to change how the ship looks and remove the collision behaviour

```typescript
for (spaceship = spaceships.head; spaceship; spaceship = spaceship.next) {
  for (asteroid = asteroids.head; asteroid; asteroid = asteroid.next) {
    if (Point.distance(asteroid.position.position, spaceship.position.position)
      <= asteroid.position.collisionRadius + spaceship.position.collisionRadius) {
      spaceship.entity.remove(MotionControls);
      spaceship.entity.remove(Motion);
      spaceship.entity.remove(GunControls);
      spaceship.entity.remove(Gun);
      spaceship.entity.remove(Collision);
      spaceship.entity.remove(Display);
      spaceship.entity.add(new Display(new SpaceshipDeathView()));
      break;
    }
  }
}
```

And finally, we need to ensure that the spaceship is removed after a short
period of time. To do this, we’ll need a new system and component like this

```typescript
class DeathThroes {
  public countdown:number;

  public constructor(duration:number) {
    countdown = duration;
  }
}
```

```typescript
class DeathThroesNode extends Node {
  public death:DeathThroes;
}
```

```typescript
class DeathThroesSystem extends ListIteratingSystem {
  private creator:EntityCreator;

  public constructor(creator:EntityCreator) {
    super(DeathThroesNode, updateNode);
    this.creator = creator;
  }

  private updateNode(node:DeathThroesNode, time:number):void {
    node.death.countdown -= time;
    if (node.death.countdown <= 0) {
      creator.destroyEntity(node.entity);
    }
  }
}
```

We add the DeathThroesSystem to the game at the start, so it will handle the
drawn-out death of any entity. Then we add the DeathThroes component to the
spaceship when it dies.

```typescript
for (spaceship = spaceships.head; spaceship; spaceship = spaceship.next) {
  for (asteroid = asteroids.head; asteroid; asteroid = asteroid.next) {
    if (Point.distance(asteroid.position.position, spaceship.position.position)
      <= asteroid.position.collisionRadius + spaceship.position.collisionRadius) {
      spaceship.entity.remove(MotionControls);
      spaceship.entity.remove(Motion);
      spaceship.entity.remove(GunControls);
      spaceship.entity.remove(Gun);
      spaceship.entity.remove(Collision);
      spaceship.entity.remove(Display);
      spaceship.entity.add(new Display(new SpaceshiopDeathView()));
      spaceship.entity.add(new DeathThroes(5));
      break;
    }
  }
}
```

And that is our state transition. The transition is achieved by altering which
components the entity has.

The state is encapsulated in its components This is the general rule of the
entity system architecture - the state of an entity is encapsulated in its
components. If you want to change how an entity is processed, you should change
its components. That will alter which systems operate on it and that changes how
the entity is processed.

Standardised state machine code To help with state machines I’ve added some
standard state machine classes to Ash. These classes help you manage states by
defining states based on the components they contain, and then changing state
simply by specifying the new state you want.

A finite state machine is an instance of the EntityStateMachine class. You pass
it a reference to the entity it will manage when constructing it. You will
usually store the state machine in a component on the entity so it can be
recovered from within any system that is operating on the entity.

```typescript
 const stateMachine:EntityStateMachine = new EntityStateMachine(guard);
```

A state machine is configured with states, and the state can be changed by
calling the state machine's changeState() method. States are identified by a
string, which is assigned when the state is created and used to identify the
state when calling the changeState() method.

States are instances of the EntityState class. They may be added to the
EntityStateMachine using the EntityStateMachine.addState() method, or they may
be created and added in one call using the EntityStateMachine.createState()
method.

```typescript
const patrolState:EntityState = stateMachine.createState('patrol');
const attackState:EntityState = stateMachine.createState('attack');
```

A state is a set of components that should be added to the entity when that
state is entered, and removed when that state exits (unless they are also
required for the next state). The add method of the EntityState specifies the
type of component required for the state and is followed by a rule specifying
how to create that component.

```typescript
const patrol:Patrol = new Patrol();
patrol.path = PatrolPathFactory.getPath(node.entity.name);
patrolState.add(Patrol)
  .withInstance(patrol);
attackState.add(Attack);
```

The four standard rules for components are

```
entityState.add(type:Class);
```

Without a rule, the state machine will create a new instance of the given type
to provide the component every time the state is entered.

```
entityState.add(type:Class).withType(otherType:Class);
```

This rule will create a new instance of the otherType every time the state is
entered. otherType should be the same as or extend the specified component type.
You only need this rule if you create component classes that extend other
component classes and should be treated as the base class by the engine, which
is rare.

entityState.add( type : Class ).withInstance( instance : * ); This method will
use the provided instance for the component every time the state is entered.

Finally

```
entityState.add(type:Class).withSingleton();
```

or

```
entityState.add(type:Class).withSingleton(otherType:Class);
```

will create a single instance and use that one instance every time the state is
entered. This is similar to using the withInstance method, but the withSingleton
method will not create the instance until it is needed. If otherType is omitted,
then the singleton with be an instance of type, if included it will be of
otherType and otherType must be the same as or extend type.

Finally, you can use custom code to provide the component by implementing the
IComponentProvider interface and then using your custom provider with

```
entityState.add(type:Class).withProvider(provider:IComponentProvider);
```

The IComponentProvider interface is defined as

```typescript
interface IComponentProvider {
  getComponent():any;

  readonly identifier:any;
}
```

The getComponent method returns a component instance. The identifier in the
IComponentProvider is used to compare two component providers to see if they
will effectively return the same component. This is used to avoid replacing a
component unnecessarily if two successive states use the same component.

The methods are designed to be chained together, to create a fluid interface, as
you’ll see in the next example.

Back to the examples If we apply these new tools to the spaceship example, the
states are set-up when the spaceship entity is created, as follows

```typescript
const fsm:EntityStateMachine = new EntityStateMachine(spaceshipEntity);

fsm.createState('playing')
  .add(Motion)
  .withInstance(new Motion(0, 0, 0, 15))
  .add(MotionControls)
  .withInstance(new MotionControls(Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, 100, 3))
  .add(Gun)
  .withInstance(new Gun(8, 0, 0.3, 2))
  .add(GunControls)
  .withInstance(new GunControls(Keyboard.SPACE))
  .add(Collision)
  .withInstance(new Collision(9))
  .add(Display)
  .withInstance(new Display(new SpaceshipView()));

fsm.createState('destroyed')
  .add(DeathThroes)
  .withInstance(new DeathThroes(5))
  .add(Display)
  .withInstance(new Display(new SpaceshipDeathView()));

const spaceshipComponent:Spaceship = new Spaceship();
spaceshipComponent.fsm = fsm;
spaceshipEntity.add(spaceshipComponent);
fsm.changeState('playing');
```

and the state change is simplified to

```typescript
for (spaceship = spaceships.head; spaceship; spaceship = spaceship.next) {
  for (asteroid = asteroids.head; asteroid; asteroid = asteroid.next) {
    if (Point.distance(asteroid.position.position, spaceship.position.position)
      <= asteroid.position.collisionRadius + spaceship.position.collisionRadius) {
      spaceship.spaceship.fsm.changeState('destroyed');
      break;
    }
  }
}
```

## To do

There will be further refinement and additions to the state machine tools based
on feedback so please do let me know how you get on with them. Use the mailing
list for Ash to get in touch.
