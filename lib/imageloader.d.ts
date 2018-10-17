export declare class ImageLoader {
    private Root;
    private DisplayUploadButton;
    private Url?;
    private InputName?;
    private Style?;
    private ButtonStyle?;
    private ImageStyle?;
    private fileLoader;
    private tag;
    private image;
    private btn_load;
    private btn_erase;
    private uploaded;
    private spinnerTemplate;
    private spinner;
    uploaded$: import("rxjs/internal/Observable").Observable<Promise<any>>;
    constructor(Root: HTMLElement, DisplayUploadButton?: boolean, Url?: string, InputName?: string, Style?: string, ButtonStyle?: string, ImageStyle?: string);
    private Init;
    private create;
    setUploadUrl: (value: string) => void;
    setInputName: (value: string) => void;
    upload: () => void;
    erase: () => void;
}
