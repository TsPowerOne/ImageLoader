export declare class ImageLoader {
    private Root;
    private Id?;
    private InputName?;
    private Url?;
    private Style?;
    private ButtonStyle?;
    private ImageStyle?;
    private DisplayUploadButton;
    private fileLoader;
    private tag;
    private image;
    private btn_load;
    private btn_erase;
    private uploaded;
    private spinnerTemplate;
    private spinner;
    uploaded$: import("rxjs/internal/Observable").Observable<Promise<any>>;
    constructor(Root: HTMLElement, Id?: string, InputName?: string, Url?: string, Style?: string, ButtonStyle?: string, ImageStyle?: string, DisplayUploadButton?: boolean);
    private Init;
    private create;
    setUploadUrl: (value: string) => void;
    setInputName: (value: string) => void;
    upload: () => void;
    erase: () => void;
}
