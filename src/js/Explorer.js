import * as PIXI from 'pixi.js';
import { keyboard } from './helpers/movement';

export default class Explorer extends PIXI.Sprite {
    constructor(texture){
        super(texture);

        this.vx = 0;
        this.vy = 0; 

        this.left = keyboard(37);
        this.right = keyboard(39);
        this.up = keyboard(38);    
        this.down = keyboard(40);

        this.left.press = () => {
            this.vx = -3;
            this.vy = 0;
        };

        this.left.release = () => {
            if (!this.right.isDown && this.vy === 0) {
            this.vx = 0;
            }
        };
        
        this.up.press = () => {
            this.vy = -3;
            this.vx = 0;
        };
        this.up.release = () => {
            if (!this.down.isDown && this.vx === 0) {
            this.vy = 0;
            }
        };

        this.right.press = () => {
            this.vx = 3;
            this.vy = 0;
        };
        this.right.release = () => {
            if (!this.left.isDown && this.vy === 0) {
            this.vx = 0;
            }
        };

        this.down.press = () => {
            this.vy = 3;
            this.vx = 0;
        };
        this.down.release = () => {
            if (!this.up.isDown && this.vx === 0) {
            this.vy = 0;
            }
        };
    }
}