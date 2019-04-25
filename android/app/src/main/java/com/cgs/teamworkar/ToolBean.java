package com.cgs.teamworkar;

public class ToolBean {
    public static final int TOOL_NONE = -11;
    public static final int TOOL_CIRCLE = 1;
    public static final int TOOL_ARROW = 2;
    private String toolName;
    private int toolId;
    private float maxScale = 0.75F;
    private float minScale =1.75F;

    public ToolBean(int id){
        this.toolId = id;
    }

    public String getToolName() {
        return toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }

    public float getMaxScale() {
        return maxScale;
    }

    public void setMaxScale(float maxScale) {
        this.maxScale = maxScale;
    }

    public float getMinScale() {
        return minScale;
    }

    public void setMinScale(float minScale) {
        this.minScale = minScale;
    }

    public int getToolId() {
        return toolId;
    }

    public void setToolId(int toolId) {
        this.toolId = toolId;
    }
}
