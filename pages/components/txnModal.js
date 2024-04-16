import React from 'react';
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from '@mui/material/CircularProgress';

function TxnModal({
    isModalOpen,
    isTxnSuccessful = false,
    onCancel,
    Error
}) {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        background: "#0B0C07",
        padding: "20px",
        textAlign: "center",
        color: "#F5F105", // Set text color to yellow
        width: 400, // Set width to 400px
        height: 200, // Set height to 200px
    };
    
    return (
        <div>
            <Modal
                open={isModalOpen}
                onClose={onCancel}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="cnt-wrapper">
                    {isTxnSuccessful ? (
                        <>
                            <h2 id="modal-modal-title">Transaction Successful</h2>
                            <p id="modal-modal-description">Your transaction was successful</p>
                        </>
                    ) : (
                        <>
                            {Error && (
                                <>
                                    <h2 id="modal-modal-title">Transaction Failed</h2>
                                    <p id="modal-modal-description">{Error}</p>
                                </>
                            )}
                            {!Error && (
                                <>
                                    <p>Confirming the Transaction</p>
                                    <CircularProgress color="inherit" />
                                    <p id="modal-modal-description">Processing...</p>
                                </>
                            )}
                        </>
                    )}
                    <button className="yellow-btn" onClick={onCancel}>
                        Cancel
                    </button>
                </Box>
            </Modal>
        </div>
    );
}

export default TxnModal;
