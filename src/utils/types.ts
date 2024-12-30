export type States = {
    [key: string]: any;
};

export type StateSetters = {
    [key: string]: React.Dispatch<React.SetStateAction<any>>;
};