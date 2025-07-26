/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

/**
 *
 * @author ADMIN
 */
public class CandidateProfileRequest {
     private String title;
    private String bio;
    private String resumeFile;

    /**
     * @return the title
     */
    public String getTitle() {
        return title;
    }

    /**
     * @param title the title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * @return the bio
     */
    public String getBio() {
        return bio;
    }

    /**
     * @param bio the bio to set
     */
    public void setBio(String bio) {
        this.bio = bio;
    }

    /**
     * @return the resumeFile
     */
    public String getResumeFile() {
        return resumeFile;
    }

    /**
     * @param resumeFile the resumeFile to set
     */
    public void setResumeFile(String resumeFile) {
        this.resumeFile = resumeFile;
    }
}
