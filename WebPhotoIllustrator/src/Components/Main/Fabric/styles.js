export const styles = {
    mainButton: {
        border: "1px solid rgba(255,255,255,0.2)",
        color: "white",
    },
    dropdownMenu: {
        position: "absolute",
        top: "110%",
        left: 0,
        backgroundColor: "#333",
        borderRadius: "4px",
        border: "1px solid #444",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        zIndex: 100,
        minWidth: "180px",
        padding: "5px 0"
    },
    menuItem: {
        padding: "10px 15px",
        color: "#eee",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        transition: "background 0.2s",
        "&:hover": {
            backgroundColor: "#444"
        }
    },
    icon: {
        marginRight: "10px",
        width: "16px",
        height: "16px"
    },
    // Modal Styles
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        backdropFilter: "blur(2px)"
    },
    modalContent: {
        backgroundColor: "#222",
        padding: "25px",
        borderRadius: "8px",
        width: "400px",
        border: "1px solid #444",
        boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
        color: "white"
    },
    modalTitle: {
        marginTop: 0,
        marginBottom: "20px",
        fontSize: "18px",
        borderBottom: "1px solid #333",
        paddingBottom: "10px"
    },
    formGroup: {
        marginBottom: "15px"
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontSize: "12px",
        color: "#aaa"
    },
    input: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #444",
        backgroundColor: "#333",
        color: "white",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box" // Важно для padding
    },
    select: {
        width: "100%",
        padding: "10px",
        borderRadius: "4px",
        border: "1px solid #444",
        backgroundColor: "#333",
        color: "white",
        fontSize: "14px",
        outline: "none",
        boxSizing: "border-box"
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "20px",
        paddingTop: "15px",
        borderTop: "1px solid #333"
    }
};