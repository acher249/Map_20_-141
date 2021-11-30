import utils from '../node_modules/decentraland-ecs-utils/index'

/// --- Set up a system ---

// Systems hold functions that change the information that’s stored in components.
// Systems are what make a static scene dynamic, allowing things to change over time or in response to player interaction.
class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  // ajc spin bool
  spinBool = true

  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      // transform.rotate(Vector3.Up(), dt * 10)
    }

  }
}

//
class ElevatorSystem {

  elevatorCube = new Entity()

  //elevator stop bool
  elevatorStop = true

  // ajc go up bool
  goUp = false

  update(dt: number) {

    // if the elevator is not stopped move it
    if(this.elevatorStop == false){

      if(this.goUp){
        log("elevator going up..")
        // go up

        this.elevatorCube.getComponent(Transform).position = new Vector3(this.elevatorCube.getComponent(Transform).position.x, 
        this.elevatorCube.getComponent(Transform).position.y + .02, 
        this.elevatorCube.getComponent(Transform).position.z) 
  
      }else{
        log("elevator going down..")
        // go down

        this.elevatorCube.getComponent(Transform).position = new Vector3(this.elevatorCube.getComponent(Transform).position.x, 
        this.elevatorCube.getComponent(Transform).position.y - .02, 
        this.elevatorCube.getComponent(Transform).position.z) 
  
      }
      log("Elevator is moving")
    }else{

      // no movement
      log("Elevator is stopped")

    }


  }
}

// now do things with face

// Add a new instance of the system to the engine
let rotSystem = new RotatorSystem()
engine.addSystem(rotSystem)

let elevatorSystem = new ElevatorSystem()
engine.addSystem(elevatorSystem)

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---
const ElevatorRootEntity = new Entity()
ElevatorRootEntity.addComponent(new Transform({ position: new Vector3(8,0,8) })) // center
engine.addEntity(ElevatorRootEntity)

const SceneRootEntity = new Entity()
SceneRootEntity.addComponent(new Transform({ position: new Vector3(8,0,8) })) // center
engine.addEntity(SceneRootEntity)

// export class SimpleRotate implements ISystem {
//   update() {
//     let transform = faceEntity.getComponent(Transform)
//     transform.rotate(Vector3.Up(), 3)
//   }
// }

// engine.addSystem(new SimpleRotate())

const pav = new Entity();
pav.addComponent(new GLTFShape("models/pav_12.glb"));
pav.addComponent(new Transform({ position: new Vector3(0,0,0), scale: new Vector3(1,1,1) }));
pav.setParent(SceneRootEntity);


// const faceEntity = new Entity();
// faceEntity.addComponent(new GLTFShape("models/face4.glb"));
// faceEntity.addComponent(new Transform());
// faceEntity.setParent(SceneRootEntity);

// ----------------

const cube = spawnCube(0, .5, 0)
cube.getComponent(Transform).scale = new Vector3(3,.1,3)
// tie this cube into the elevator system
elevatorSystem.elevatorCube = ElevatorRootEntity

// ------ Create Buttons -------- //
const ElevtorUpDownButton = spawnCube(1, .5, 3)
const ElevtorStopButton = spawnCube(2, .5, 3)

// make everything in Elevator child to rootEntity, then move root entity, so that parent tranforms dont effect children
cube.setParent(ElevatorRootEntity)
ElevtorUpDownButton.setParent(ElevatorRootEntity)
ElevtorStopButton.setParent(ElevatorRootEntity)

ElevtorUpDownButton.getComponent(Transform).scale = new Vector3(.4,.4,.4)
ElevtorStopButton.getComponent(Transform).scale = new Vector3(.4,.4,.4)

//Create material and configure its fields
const RedMaterial = new Material()
RedMaterial.albedoColor = Color3.Red()
RedMaterial.metallic = 0.9
RedMaterial.roughness = 0.1

const GreenMaterial = new Material()
GreenMaterial.albedoColor = Color3.Green()
GreenMaterial.metallic = 0.9
GreenMaterial.roughness = 0.1

//Assign the material to the entity
ElevtorStopButton.addComponent(RedMaterial)
ElevtorUpDownButton.addComponent(GreenMaterial)

// tell elevator which way to go
ElevtorUpDownButton.addComponent(
  new OnClick(() => {

    // if we click to move the elevator up or down, it should no longer be stopped
    elevatorSystem.elevatorStop = false

    // now switch it
    if (elevatorSystem.goUp){
      elevatorSystem.goUp = false
    }else{
      elevatorSystem.goUp = true
    }

  })
)

/// tell elevator to stop or not
ElevtorStopButton.addComponent(
  new OnClick(() => {

    if (elevatorSystem.elevatorStop){
      elevatorSystem.elevatorStop = false
    }else{
      elevatorSystem.elevatorStop = true
    }

  })
)

// create function that switches a boolean that is built into the main Rotator System 
// then you can check against this on update
function switchBool(){

  // switch the bool on click
  if (rotSystem.spinBool){
    rotSystem.spinBool = false 
  }else{
    rotSystem.spinBool = true
  }

}