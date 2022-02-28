// Create Wing Class

import engine from "../../engine/index.js";
import Lerp from "../../engine/utils/lerp.js";
import LerpVec2 from "../../engine/utils/lerp_vec2.js";

class Wing extends engine.GameObject {
  constructor(texture, x1, y1) {
    super(null);
    this.mRenderComponent = new engine.SpriteAnimateRenderable(texture);
    this.mRenderComponent.setColor([1, 1, 1, 0]);
    this.mRenderComponent.setElementPixelPositions(0, 184, 204, 348);
      this.mRenderComponent.getXform().setSize(10, 8);
      this.mRenderComponent.getXform().setPosition(x1, y1);
      this.mRenderComponent.setSpriteSequence(512, 0,
        204, 164,
        5,
        0);
      this.mRenderComponent.setAnimationType(engine.eAnimationType.eSwing);
      this.mRenderComponent.setAnimationSpeed(60);
    this.linIntX = new Lerp(this.mRenderComponent.getXform().getXPos(), 120, 0.05);
    this.linIntY = new Lerp(this.mRenderComponent.getXform().getYPos(), 120, 0.05);
    this.wingBoundingBox = this.getBBox();
  }

  

  // 
  update(targetx, targety) {
    this.mRenderComponent.updateAnimation();
    this.wingBoundingBox = this.getBBox();
  }

  interpolateValue(position, type) {
    let xInterpolationValue = position[0] + 10;
    let yInterpolationValue = type === "bottom" ? position[1] - 6 : position[1] + 6;

    this.linIntX.setFinal(xInterpolationValue);
    this.linIntX.update();
    this.mRenderComponent.getXform().setXPos(this.linIntX.get());
    this.linIntY.setFinal(yInterpolationValue);
    this.linIntY.update();
    this.mRenderComponent.getXform().setYPos(this.linIntY.get());
    this.mRenderComponent.updateAnimation();
  }


  dyeHit() {
    let a = this.mRenderComponent.getColor()[3] + 0.2;
    this.mRenderComponent.setColor([1, 1, 1, a]);
  }

  getAlpha(){
      return this.mRenderComponent.getColor()[3]
  }

}
export default Wing;