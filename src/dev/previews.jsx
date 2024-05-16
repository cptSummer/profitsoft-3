import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import Header from "../app/components/Header";
import Index from "../pages/default";
import Default from "../pages/default/containers/Default";
import App from "../app/containers/App";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/Header">
                <Header/>
            </ComponentPreview>
            <ComponentPreview path="/Index">
                <Index/>
            </ComponentPreview>
            <ComponentPreview path="/Default">
                <Default/>
            </ComponentPreview>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
