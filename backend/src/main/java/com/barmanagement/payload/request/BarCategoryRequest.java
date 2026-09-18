package com.barmanagement.payload.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BarCategoryRequest {

    @NotBlank(message = "Category name is required.")
    @Size(
        min = 2,
        max = 100,
        message = "Category name must be between 2 and 100 characters."
    )
    private String categoryName;


    @Size(
        max = 300,
        message = "Description cannot exceed 300 characters."
    )
    private String description;


    @Min(
        value = 0,
        message = "Display order cannot be negative."
    )
    private Integer displayOrder;


    private Boolean active;


    public BarCategoryRequest() {
    }


    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }


    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}