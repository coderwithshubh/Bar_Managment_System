import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    X,
    Camera,
    RefreshCw
} from "lucide-react";

import {
    Html5Qrcode,
    Html5QrcodeSupportedFormats
} from "html5-qrcode";

import "./QrScanner.css";


function QrScanner({
    onClose,
    onScan
}) {

    // ==========================================
    // REFS
    // ==========================================

    const scannerRef = useRef(null);

    const startedRef = useRef(false);

    const stoppingRef = useRef(false);

    const mountedRef = useRef(false);

    const scanCompletedRef = useRef(false);

    const onScanRef = useRef(onScan);


    // ==========================================
    // STATE
    // ==========================================

    const [error, setError] = useState("");


    // ==========================================
    // KEEP LATEST onScan CALLBACK
    // ==========================================

    useEffect(() => {

        onScanRef.current = onScan;

    }, [onScan]);


    // ==========================================
    // QR SCANNER
    // ==========================================

    useEffect(() => {

        let disposed = false;

        mountedRef.current = true;


        const scannerId =
            "bar-inventory-qr-reader";


        // ======================================
        // CLEAR OLD CAMERA ELEMENTS
        // ======================================

        const container =
            document.getElementById(
                scannerId
            );


        if (container) {

            container.innerHTML = "";

        }


        // ======================================
        // CREATE SCANNER
        // ======================================

        const scanner =
            new Html5Qrcode(
                scannerId,
                {
                    verbose: false
                }
            );


        scannerRef.current =
            scanner;


        // ======================================
        // STOP SCANNER
        // ======================================

        const stopScanner =
            async () => {

                if (
                    stoppingRef.current
                ) {
                    return;
                }


                if (
                    !startedRef.current
                ) {
                    return;
                }


                stoppingRef.current =
                    true;


                try {

                    console.log(
                        "Stopping QR scanner..."
                    );


                    await scanner.stop();


                    console.log(
                        "QR scanner stopped."
                    );

                } catch (err) {

                    console.warn(
                        "QR scanner stop error:",
                        err
                    );

                } finally {

                    startedRef.current =
                        false;

                    stoppingRef.current =
                        false;

                }

            };


        // ======================================
        // START SCANNER
        // ======================================

        const startScanner =
            async () => {

                try {

                    if (
                        disposed
                    ) {
                        return;
                    }


                    setError("");


                    console.log(
                        "Starting QR scanner..."
                    );


                    // ==================================
                    // GET AVAILABLE CAMERAS
                    // ==================================

                    const cameras =
                        await Html5Qrcode.getCameras();


                    if (
                        disposed
                    ) {
                        return;
                    }


                    console.log(
                        "Available cameras:",
                        cameras
                    );


                    if (
                        !cameras ||
                        cameras.length === 0
                    ) {

                        throw new Error(
                            "No camera was found on this device."
                        );

                    }


                    // ==================================
                    // SELECT CAMERA
                    // ==================================

                    let selectedCamera =
                        cameras[0];


                    const rearCamera =
                        cameras.find(
                            camera => {

                                const label =
                                    (
                                        camera.label ||
                                        ""
                                    ).toLowerCase();


                                return (
                                    label.includes(
                                        "back"
                                    ) ||
                                    label.includes(
                                        "rear"
                                    ) ||
                                    label.includes(
                                        "environment"
                                    )
                                );

                            }
                        );


                    if (rearCamera) {

                        selectedCamera =
                            rearCamera;

                    }


                    console.log(
                        "Selected camera:",
                        selectedCamera
                    );


                    // ==================================
                    // START CAMERA
                    // ==================================

                    await scanner.start(

                        selectedCamera.id,

                        {

                            fps: 15,

                            qrbox: {
                                width: 280,
                                height: 280
                            },

                            formatsToSupport: [
                                Html5QrcodeSupportedFormats.QR_CODE
                            ],

                            disableFlip: false

                        },


                        // ==================================
                        // QR SUCCESS
                        // ==================================

                        async (
                            decodedText,
                            decodedResult
                        ) => {

                            console.log(
                                "QR DETECTED:",
                                decodedText
                            );


                            console.log(
                                "QR RESULT:",
                                decodedResult
                            );


                            // Prevent duplicate scan
                            if (
                                scanCompletedRef.current
                            ) {
                                return;
                            }


                            scanCompletedRef.current =
                                true;


                            // ==================================
                            // STOP CAMERA AFTER SUCCESS
                            // ==================================

                            try {

                                if (
                                    startedRef.current &&
                                    !stoppingRef.current
                                ) {

                                    stoppingRef.current =
                                        true;


                                    await scanner.stop();


                                    console.log(
                                        "Scanner stopped after successful scan."
                                    );

                                }

                            } catch (stopError) {

                                console.warn(
                                    "Scanner stop error:",
                                    stopError
                                );

                            } finally {

                                startedRef.current =
                                    false;

                                stoppingRef.current =
                                    false;

                            }


                            // ==================================
                            // SEND QR TO PARENT
                            // ==================================

                            if (
                                !disposed &&
                                mountedRef.current &&
                                onScanRef.current
                            ) {

                                onScanRef.current(
                                    decodedText.trim()
                                );

                            }

                        },


                        // ==================================
                        // QR FAILURE CALLBACK
                        // ==================================

                        () => {

                            // Ignore frames where
                            // QR code is not detected.

                        }

                    );


                    // ==================================
                    // IMPORTANT STRICTMODE CHECK
                    // ==================================

                    if (disposed) {

                        /*
                         * React StrictMode may have
                         * unmounted this effect while
                         * scanner.start() was still running.
                         *
                         * The camera has now started,
                         * so immediately stop it.
                         */

                        try {

                            await scanner.stop();

                        } catch {

                            // Ignore cleanup error

                        }

                        return;

                    }


                    // ==================================
                    // SCANNER IS RUNNING
                    // ==================================

                    startedRef.current =
                        true;


                    console.log(
                        "QR scanner started successfully."
                    );


                    console.log(
                        "Camera:",
                        selectedCamera.label
                    );


                } catch (err) {

                    console.error(
                        "================================"
                    );

                    console.error(
                        "QR SCANNER ERROR"
                    );

                    console.error(
                        "Error name:",
                        err?.name
                    );

                    console.error(
                        "Error message:",
                        err?.message
                    );

                    console.error(
                        "Full error:",
                        err
                    );

                    console.error(
                        "================================"
                    );


                    if (
                        disposed
                    ) {
                        return;
                    }


                    let errorMessage =
                        "Unable to start camera.";


                    if (
                        err?.name ===
                        "NotAllowedError"
                    ) {

                        errorMessage =
                            "Camera permission was denied. Please allow camera access for localhost.";

                    }


                    else if (
                        err?.name ===
                        "NotFoundError"
                    ) {

                        errorMessage =
                            "No camera was found on this device.";

                    }


                    else if (
                        err?.name ===
                        "NotReadableError"
                    ) {

                        errorMessage =
                            "Camera is already being used by another application.";

                    }


                    else if (
                        err?.name ===
                        "OverconstrainedError"
                    ) {

                        errorMessage =
                            "The selected camera cannot be opened.";

                    }


                    else if (
                        err?.name ===
                        "SecurityError"
                    ) {

                        errorMessage =
                            "The browser blocked camera access.";

                    }


                    else if (
                        err?.message
                    ) {

                        errorMessage =
                            `${err?.name || "Camera Error"}: ${err.message}`;

                    }


                    setError(
                        errorMessage
                    );

                }

            };


        // ======================================
        // START
        // ======================================

        startScanner();


        // ======================================
        // CLEANUP
        // ======================================

        return () => {

            disposed = true;

            mountedRef.current =
                false;


            /*
             * If scanner has already started,
             * stop it immediately.
             *
             * If start() is still pending,
             * the disposed check above will
             * stop it after start completes.
             */

            if (
                startedRef.current
            ) {

                stopScanner();

            }

        };

    }, []);


    // ==========================================
    // UI
    // ==========================================

    return (

        <div
            className="qr-scanner-overlay"
        >

            <div
                className="qr-scanner-modal"
            >


                {/* ==================================
                    HEADER
                ================================== */}

                <div
                    className="qr-scanner-header"
                >

                    <div>

                        <div
                            className="qr-scanner-title"
                        >

                            <Camera
                                size={21}
                            />

                            <h2>
                                Scan Product QR
                            </h2>

                        </div>


                        <p>
                            Point the camera at the QR code.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close scanner"
                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>


                {/* ==================================
                    CAMERA
                ================================== */}

                <div
                    className="qr-reader-wrapper"
                >

                    <div
                        id="bar-inventory-qr-reader"
                    />

                </div>


                {/* ==================================
                    ERROR
                ================================== */}

                {error && (

                    <div
                        className="qr-scanner-error"
                    >

                        <RefreshCw
                            size={17}
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* ==================================
                    FOOTER
                ================================== */}

                <div
                    className="qr-scanner-footer"
                >

                    <span>
                        Keep the QR code clearly visible
                        inside the scanning box.
                    </span>


                    <button
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                </div>


            </div>

        </div>

    );

}


export default QrScanner;