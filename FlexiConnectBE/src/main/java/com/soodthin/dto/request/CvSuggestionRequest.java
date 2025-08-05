/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

import com.soodthin.entity.CvSuggestion.SectionType;

/**
 *
 * @author ADMIN
 */
public class CvSuggestionRequest {
    private String originalInput;
    private SectionType section;

    /**
     * @return the originalInput
     */
    public String getOriginalInput() {
        return originalInput;
    }

    /**
     * @param originalInput the originalInput to set
     */
    public void setOriginalInput(String originalInput) {
        this.originalInput = originalInput;
    }

    /**
     * @return the section
     */
    public SectionType getSection() {
        return section;
    }

    /**
     * @param section the section to set
     */
    public void setSection(SectionType section) {
        this.section = section;
    }

   
}
