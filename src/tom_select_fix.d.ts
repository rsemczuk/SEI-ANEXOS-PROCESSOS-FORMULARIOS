import TomSelect from "../node_modules/tom-select/dist/types/tom-select";
import { TomSettings } from "../node_modules/tom-select/dist/types/types/settings";

declare global {
    class _TomSelect extends TomSelect{}
    type _TomSettings = TomSettings;

}


