function downloadStringAsFile(data: string, filename: string) {
    let a = document.createElement('a');
    a.download = filename;
    a.href = data;
    a.click();
}
export function onCanvasButtonClick(
    canvasRef: React.RefObject<HTMLCanvasElement>,
) {
    const node = canvasRef.current;
    if (node == null) {
        return;
    }
    // For canvas, we just extract the image data and send that directly.
    const dataURI = node.toDataURL('image/png');

    downloadStringAsFile(dataURI, 'qrcode-canvas.png');
}

export async function copyCanvasToClipboard(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    setToggleIcon: React.Dispatch<React.SetStateAction<boolean[]>>,
) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((blob) => resolve(blob), 'image/png'),
        );

        if (blob) {
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob,
                }),
            ]);
            setToggleIcon((prev) => {
                return prev.map((_, i) => (i === 2 ? !prev[i] : prev[i]));
            });
        }
    } catch (err) {
        console.error('Failed to copy image: ', err);
    }
}

export const copyText = (
    value: string,
    idx: number,
    setToggleIcon: React.Dispatch<React.SetStateAction<boolean[]>>,
) => {
    // firefox does not support navigator.clipboard.writeText

    navigator.clipboard.writeText(value);
    setToggleIcon((prev) => {
        return prev.map((_, i) => (i === idx ? !prev[i] : prev[i]));
    });
};
