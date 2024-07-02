<?php 

return [
    'debug' => true,
    'content' => [
      'uuid' => false,
    ],
    'routes' => [
      [
        'pattern' => 'phpconfig',
        'action'  => function () {
          phpinfo();
          return true;
        }
      ],
      [
      'pattern' => '/download-workshops-images',
      'action'  => function () {
        return downloadImages("https://play-the-system.xyz/wp-json/pts-export/v1/get_workshops", "workshop", "workshops");
        }
      ],
      [
      'pattern' => '/download-ausstellungen-images',
      'action'  => function () {
        return downloadImages("https://play-the-system.xyz/wp-json/pts-export/v1/get_ausstellungen", "ausstellung", "ausstellungen");
        }
      ],
      [
      'pattern' => '/download-exkursionen-images',
      'action'  => function () {
        return downloadImages("https://play-the-system.xyz/wp-json/pts-export/v1/get_exkursionen", "exkursion", "exkursionen");
        }
      ],
      [
      'pattern' => '/download-kurse-images',
      'action'  => function () {
        return downloadImages("https://play-the-system.xyz/wp-json/pts-export/v1/get_kurse", "kurs", "kurse");
        }
      ],
      [
      'pattern' => '/download-publikationen-images',
      'action'  => function () {
        return downloadImages("https://play-the-system.xyz/wp-json/pts-export/v1/get_publikationen", "publikation", "publikationen");
        }
      ],



      [
        'pattern' => '/import-projekte',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_projekte", "projekt", "projekte");                    
        }
      ],
      [
        'pattern' => '/import-personen',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_personen", "person", "personen");          
        }
      ],
      [
        'pattern' => '/import-kurse',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_kurse", "kurs", "kurse");          
        }
      ],
      [
        'pattern' => '/import-ausstellungen',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_ausstellungen", "ausstellung", "ausstellungen");          
        }
      ],
      [
        'pattern' => '/import-exkursionen',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_exkursionen", "exkursion", "exkursionen");          
        }
      ],
      [
        'pattern' => '/import-workshops',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_workshops", "workshop", "workshops");          
        }
      ],
      [
        'pattern' => '/import-texte',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_texte", "text", "texte");          
        }
      ],
      [
        'pattern' => '/import-publikationen',
        'action'  => function () {
          return importPosts("https://play-the-system.xyz/wp-json/pts-export/v1/get_publikationen", "publikation", "publikationen");          
        }
      ],

      [
        'pattern' => '/rename-fields',
        'action'  => function () {
          $kirby = kirby();
          $root = $kirby->root();

          $fields = [
            'technology' => 'technologie',
            'author' => 'autorinnen',
            'course' => 'kurs',
          ];

          $projekte = page('projekte')->children();

          foreach($projekte as $projekt) {
            $newContent = [];

            foreach($fields as $oldField => $newField) {
              if($projekt->$oldField()->isNotEmpty()) {
                $newContent[$newField] = $projekt->$oldField()->value();
              }
            }

            try {
              $projekt->update($newContent);
            } catch(Exception $e) {
              return $e->getMessage();            
            }
          }
        }
      ]
    ],
];

function importPosts($apiURL, $template, $parent) {
  $kirby = kirby();
  $root = $kirby->root();

  $response = file_get_contents($apiURL);
  $data = json_decode($response, true);
  $posts = [];

  $count = 0;

  foreach($data as $post) {
    $slug = $post['folder_name'];                
    $images = [];            
    $kirbyFilenames = [];

    // if($count > 3) {
    //   break;
    // }

    $page = page($parent . '/' . $slug);
    if(!$page) {
      try {
        $page = page($parent)->createChild([
          'slug' => $slug,
          'template' => $template,
          'isDraft' => false,
          'content' => [
            'title' => $post['post_title'],
          ],
        ]);
      }
      catch(Exception $e) {
        return $e->getMessage();
      }
    }

    $content = [];

    /* IMAGES */
    $files = [];
    if(isset($post['images']) && is_array($post['images'])){
      foreach($post['images'] as $image) {
        try {
          $imageFile = $page->createFile([
            'filename' => $image['filename'],
            'source' => $root . '/images/' . $parent . '/' . $slug . '/' . $image['filename'],
          ]);

          $files[] = $imageFile;
        }
        catch(Exception $e) {
          return $e->getMessage();
        }

      }

      $content['bilder'] = array_map(function($file) {
        return $file->id();
      }, $files);
    }    

    /* FIELDS */

    foreach($post['fields'] as $fieldName => $field) {

      switch ($field['fieldtype']) {
        case 'tags':
          $content[$fieldName] = implode(",", $field['value']);
          break;

        case 'text':
          $content[$fieldName] = $field['value'];
          break;

        case 'pages':
          $pageFields = [];
          foreach($field['value'] as $pageField) {
            $pageFields[] = $field['parent'] . "/" . $pageField;
          }

          $content[$fieldName] = $pageFields;
          break;

        case 'checkbox':
          $content[$fieldName] = implode(",", $field['value']);
          break;

        case 'structure':
          if($field['value'] && is_array($field['value'])) {
            $urls = array_column($field['value'], 'youtube_url');
            $content[$fieldName] = implode(",", $urls);
          }
          break;

      }
    }

    try {
      $page->update($content);
    } catch(Exception $e) {
      return $e->getMessage();
    }


    $posts[] = [
      'title' =>  $post['post_title'],
      'slug' => $post['folder_name'],
      'content' => $content,    
    ];

    $count++;

  }

  return $posts;
}

function downloadImages($apiURL, $template, $parent) {
  $kirby = kirby();
  $root = $kirby->root();

  $apiURL = $apiURL;
  $response = file_get_contents($apiURL);
  $data = json_decode($response, true);


  foreach($data as $post) {
    $slug = $post['folder_name'];
    $images = [];

    foreach($post['images'] as $image) {
      $imageContent = file_get_contents($image['url']);
      $imageDir = $root . '/images/' . $parent . '/' . $slug;
      $imagePath = $imageDir . "/" . $image['filename'];

      if (!file_exists($imageDir)) {
        mkdir($imageDir, 0777, true);
      }

      file_put_contents($imagePath, $imageContent);

      $images[] = [
        'url' => $image['url'],
        'path' => $imagePath,
      ];
    }
  }

  return $images;
}