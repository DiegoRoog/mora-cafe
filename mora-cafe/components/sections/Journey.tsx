import {RoastJourney} from './RoastJourney';
import {FlavorMarquee} from './FlavorMarquee';
import {CoffeeCards} from './CoffeeCards';
import {Visit} from './Visit';
import styles from './Journey.module.css';
export function Journey(){return <section id="cafes" className={styles.journey} aria-label="A jornada do grão e nossos cafés"><RoastJourney/><FlavorMarquee/><CoffeeCards/><Visit/><div className={styles.curtainFoot}/></section>}
