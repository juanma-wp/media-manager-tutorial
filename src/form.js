export const form = {
  layout: {
		type: 'panel',
	},
	fields: [
  
		'title.raw',
		'alt_text',
		'caption.raw',
		'description.raw',
		'date',
    {
			id: 'fileInfo',
			
			layout: {
				type: 'row',
        alignment: 'center',
			},
			children: [ 'filesize', 'mime_type', 'width', 'height' ],
		},
	],
};