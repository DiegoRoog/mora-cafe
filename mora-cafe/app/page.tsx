import {SiteNav} from '@/components/nav/SiteNav';
import {SectionMarker} from '@/components/ui/SectionMarker';
import {SmoothScroll} from '@/components/scroll/SmoothScroll';
import {Hero} from '@/components/sections/Hero';
import {Story} from '@/components/sections/Story';
import {Journey} from '@/components/sections/Journey';
import {Contact} from '@/components/sections/Contact';
export default function Home(){return <><SiteNav/><SectionMarker/><SmoothScroll/><main id="conteudo"><Hero/><Story/><Journey/><Contact/></main></>}
