export declare class ImageLoaderSetter {
    Root: HTMLElement;
    Id?: string;
    InputName?: string;
    Src?: string;
    Autosave?: boolean;
    Url?: string;
    Style?: string;
    ButtonStyle?: string;
    ImageStyle?: string;
    DisplayUploadButton: boolean;
}
export declare class ImageLoader {
    private fileLoader;
    private tag;
    private image;
    private btn_load;
    private btn_erase;
    private uploaded;
    private erased;
    private spinnerTemplate;
    private spinner;
    private Root;
    private Autosave;
    private Id?;
    private InputName?;
    private Src?;
    private Url?;
    private Style?;
    private ButtonStyle?;
    private ImageStyle?;
    private DisplayUploadButton;
    private Loader;
    uploaded$: import("rxjs").Observable<Promise<any>>;
    erased$: import("rxjs").Observable<any>;
    FileName: any;
    constructor(setter: ImageLoaderSetter);
    private Init;
    private create;
    private enableButton;
    private disableButton;
    setUploadUrl: (value: string) => void;
    setInputName: (value: string) => void;
    upload: () => void;
    erase: () => void;
    setAutosave: (autosave: boolean) => boolean;
}
