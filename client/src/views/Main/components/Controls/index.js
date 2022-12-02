// React
import React, { useState } from 'react';

// Icons
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import HighlightAltOutlinedIcon from '@mui/icons-material/HighlightAltOutlined';
import PolylineOutlinedIcon from '@mui/icons-material/PolylineOutlined';
import ShapeLineOutlinedIcon from '@mui/icons-material/ShapeLineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

// Global Components
import {
    Tooltip
} from '../../../../components';

// Editor Modes
import {
    DrawLineStringMode,
    DrawPolygonMode,
    MeasureAngleMode,
    MeasureAreaMode,
    ViewMode,
    ModifyMode,
    TranslateMode,
    TransformMode
} from "nebula.gl";

// CSS
import "./Controls.css"

const EditorControl = props => {
    const { title, children, onClick, selected } = props;
    const className = (!selected)
                    ? "controls-editor__option"
                    : "controls-editor__option controls-editor__option-selected";
    return (
        <div onClick={onClick} className={className}>
            <div className="controls-editor__option-icon">
                {children}
            </div>
            <div className="controls-editor__option-label">
                {title}
            </div>
        </div>
    )
}

const CHECK_MODE = (mode) => {
    switch (mode.toString()) {
        case (ModifyMode).toString():
            return "SELECT";
        case (DrawLineStringMode).toString():
            return "LINE";
        case (DrawPolygonMode).toString():
            return "POLYGON"
        default:
            return ""
    }
};

const EditorControls = props => {
    const { setMode, mode, showEditor, setShowEditor } = props;
    const CUR_MODE = CHECK_MODE(mode);

    return (
        <div className="controls-editor">
            <EditorControl
                title="Select"
                selected={CUR_MODE == "SELECT"}
                onClick={() => setMode(() => ModifyMode)}
            >
                <HighlightAltOutlinedIcon/>
            </EditorControl>
            <EditorControl
                title="Polygon"
                selected={CUR_MODE == "POLYGON"}
                onClick={() => setMode(() => DrawPolygonMode)}
            >
                <PolylineOutlinedIcon />
            </EditorControl>
            <EditorControl
                title="Line"
                selected={CUR_MODE == "LINE"}
                onClick={() => setMode(() => DrawLineStringMode)}
            >
                <ShapeLineOutlinedIcon />
            </EditorControl>
            <EditorControl
                onClick={() => setShowEditor(!showEditor)}
                title={(showEditor) ? "Hide" : "Show"}
            >
                {(showEditor) ? (
                    <VisibilityOutlinedIcon />
                ) : (
                    <VisibilityOffOutlinedIcon/>
                )}
            </EditorControl>
        </div>
    );
};

const Controls = props => {
    const { setMode, mode, showEditor, setShowEditor } = props;
    const [showEditorControls, setShowEditorControls] = useState(false);

    const toggleEdit = () => {
        setShowEditorControls(!showEditorControls);
    }

    return (
        <div className="controls-outermost">
            <div className="controls-outer">
                {(showEditorControls) && (
                    <EditorControls
                        setMode={setMode}
                        mode={mode}
                        showEditor={showEditor}
                        setShowEditor={setShowEditor}
                        />
                )}
                <div className="controls">
                    <Tooltip content="Draw Routes" direction="left">
                        <ModeEditOutlineOutlinedIcon
                            onClick={toggleEdit}
                            className="icon controls-icon"
                            sx={{
                                color: (showEditor) ? "white" : "rgb(106, 116, 133)"
                            }}/>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default Controls;