import {MonacoBinding} from "y-monaco";

export const createBinding = (ytext, editor, awareness) => {
    const model=editor.getModel();

    const binding=new MonacoBinding(ytext, model,new Set([editor]),awareness);

    return binding;
};