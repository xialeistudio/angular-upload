<?php
/**
 * @project xl-angular-upload
 * @date 2015-4-9
 * @author xialei <xialeistudio@gmail.com>
 */
//init dir
header('Content-Type: application/json;charset=utf-8');
$path = '/home/vcap/fs/0810f838fdab5b3';
if (!is_dir($path))
    mkdir($path, 666);


$file = $_FILES['file'];
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = date('YmdHis') . substr(uniqid(), 2, 4) . '.' . $ext;
$savePath = $path . '/' . $filename;
if (!is_uploaded_file($file['tmp_name'])) {
    echo json_encode([
        'error' => '没有文件被上传'
    ]);
    exit;
}
if($file['size']>200*1024){
    echo json_encode([
        'error'=>'上传文件不能大于2M'
    ]);
    exit;
}
if (!move_uploaded_file($file['tmp_name'], $savePath)) {
    echo json_encode([
        'error' => '上传失败'
    ]);
    exit;
}
echo json_encode([
    'name' => $file['name'],
    'size' => $file['size'],
    'type' => $file['type'],
    'url' => $_SERVER['HTTP_ORIGIN'] . '/uploads/' . $filename
]);
exit;