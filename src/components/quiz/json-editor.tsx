import ReactJson from "@microlink/react-json-view";

const JsonEditor = ({ data, ...props }: any) => {
    return (
        <div className="rounded-lg border bg-card p-4">
            <ReactJson
                src={data}
                name={false}
                theme="rjv-default"
                displayDataTypes={false}
                enableClipboard={false}
                {...props}
            />
        </div>
    );
};

export default JsonEditor;
