package com.zhenhai.programmer.controller.common;

import com.zhenhai.programmer.bean.CodeMsg;
import com.zhenhai.programmer.dto.ResponseDTO;
import com.zhenhai.programmer.utils.CommonUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;

/**
 * Unified Image Viewer
 */
@RequestMapping("/common/photo")
@RestController
public class PhotoController {

    @Autowired
    private ResourceLoader resourceLoader;

    @Value("${zhenhai.upload.photo.path}")
    private String uploadPhotoPath;//File storage location

    private static final Logger logger = LoggerFactory.getLogger(PhotoController.class);

    /**
     * System unified image viewing method
     * @param filename
     * @return
     */
    @RequestMapping(value="/view")
    public ResponseEntity<?> viewPhoto(@RequestParam(name="filename", required=true)String filename){
        // Ensure forward slashes are used instead of backslashes
        filename = filename.replace('\\', '/');
        // Ensure path ends with separator
        String normalizedPath = uploadPhotoPath;
        if (!normalizedPath.endsWith("/") && !normalizedPath.endsWith(File.separator)) {
            normalizedPath = normalizedPath + "/";
        }

        Resource resource = resourceLoader.getResource("file:" + normalizedPath + filename);
        try {
            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            logger.error("Failed to load image: " + normalizedPath + filename, e);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Unified image upload processing
     * @param photo
     * @param request
     * @return
     */
    @PostMapping(value="/upload_photo")
    public ResponseDTO<String> uploadPhoto(MultipartFile photo, HttpServletRequest request){
        if(photo == null){
            return ResponseDTO.errorByMsg(CodeMsg.PHOTO_EMPTY);
        }
        //Check upload file size, cannot exceed 1MB
        if(photo.getSize() > 1*1024*1024) {
            return ResponseDTO.errorByMsg(CodeMsg.PHOTO_SURPASS_MAX_SIZE);
        }
        //Get file extension
        String suffix = photo.getOriginalFilename().substring(photo.getOriginalFilename().lastIndexOf(".")+1,photo.getOriginalFilename().length());
        if(!CommonUtil.isPhoto(suffix)){
            return ResponseDTO.errorByMsg(CodeMsg.PHOTO_FORMAT_NOT_CORRECT);
        }

        String formattedDate = CommonUtil.getFormatterDate(new Date(), "yyyyMMdd");

        // Use Path class to build path, ensure cross-platform compatibility
        String normalizedPath = uploadPhotoPath;
        if (!normalizedPath.endsWith("/") && !normalizedPath.endsWith(File.separator)) {
            normalizedPath = normalizedPath + File.separator;
        }

        Path saveDirPath = Paths.get(normalizedPath, formattedDate);
        String savePath = saveDirPath.toString() + File.separator;

        File savePathFile = new File(savePath);
        if(!savePathFile.exists()){
            //If directory doesn't exist, create all necessary parent directories
            savePathFile.mkdirs();
        }

        String filename = new Date().getTime() + "." + suffix;
        logger.info("Image save path: {}", savePath + filename);

        try {
            //Save file to specified directory
            photo.transferTo(new File(savePath + filename));
        } catch (Exception e) {
            logger.error("Failed to save image", e);
            e.printStackTrace();
            return ResponseDTO.errorByMsg(CodeMsg.SAVE_FILE_EXCEPTION);
        }

        // Return path using forward slashes to ensure consistent frontend display
        String filepath = formattedDate + "/" + filename;
        return ResponseDTO.successByMsg(filepath, "Image uploaded successfully!");
    }
}