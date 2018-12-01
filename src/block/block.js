/**
 * BLOCK: cta-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import classnames from 'classnames';

//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { Fragment } = wp.element;
const { IconButton, PanelBody, ToggleControl, Toolbar } = wp.components;
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { BlockControls, InnerBlocks, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck } = wp.editor;

const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

const TEMPLATE = [
	[ 'core/heading',   { align: 'center', content: 'Call to Action Headline' } ],
	[ 'core/paragraph', { align: 'center', content: 'Clear, and easy to update.' }     ],
	[ 'core/button',    { align: 'center', text: 'Button text', url: 'https://www.google.com' }     ],
];

/**
 * Register: a Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'brunel/cta-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Call To Action' ), // Block title.
	icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Call to Action' ),
		__( 'CTA' ),
	],

	attributes: {
		backgroundType: {
			type: 'string',
			default: 'image', // no image by default!
		},
		hasParallax: {
			type: 'boolean',
			default: 'false',
		},
		id: {
			type: 'number',
		},
		url: {
			type: 'string',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( props ) {
		const {
			setAttributes,
			attributes,
			className,
		} = props;
		const {
			backgroundType,
			hasParallax,
			id,
			url,
		} = props.attributes;

		const onSelectMedia = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}
			let mediaType;
			// for media selections originated from a file upload.
			if ( media.media_type ) {
				if ( media.media_type === IMAGE_BACKGROUND_TYPE ) {
					mediaType = IMAGE_BACKGROUND_TYPE;
				} else {
					// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
					// Videos contain the media type of 'file' in the object returned from the rest api.
					mediaType = VIDEO_BACKGROUND_TYPE;
				}
			} else { // for media selections originated from existing files in the media library.
				if (
					media.type !== IMAGE_BACKGROUND_TYPE &&
					media.type !== VIDEO_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			setAttributes( {
				url: media.url,
				id: media.id,
				backgroundType: mediaType,
			} );
		};

		const style = {
			...(
				backgroundType === IMAGE_BACKGROUND_TYPE ?
					backgroundImageStyles( url ) :
					{}
			),
		};

		const classes = classnames(
			className,
			{
				'has-parallax': hasParallax,
			}
		);

		const controls = (
			<Fragment>
				<BlockControls>
					{ !! url && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ id }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Edit media' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>
				{ !! url && (
					<InspectorControls>
						<PanelBody title={ __( 'Cover Settings' ) }>
							{ IMAGE_BACKGROUND_TYPE === backgroundType && (
								<ToggleControl
									label={ __( 'Fixed Background' ) }
									checked={ hasParallax }
									onChange={ () => { setAttributes( { hasParallax: ! attributes.hasParallax } ) } }
								/>
							) }
						</PanelBody>
					</InspectorControls>
				) }
			</Fragment>
		);
		
		if ( ! url ) {
			const icon = 'format-image';
			
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ icon }
						className={ className }
						labels={ {
							title: "Upload Image",
							instructions: __( 'Drag an image or a video, upload a new one or select a file from your library.' ),
						} }
						onSelect={ onSelectMedia }
						accept="image/*,video/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ controls }
				<div
					data-url={ url }
					style={ style }
					className={ classes }
				>
					{ VIDEO_BACKGROUND_TYPE === backgroundType && (
						<video
							className="wp-block-cover__video-background"
							autoPlay
							muted
							loop
							src={ url }
						/>
					) }
					<InnerBlocks
						template={TEMPLATE}
						templateLock="all"
					/>
				</div>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( props ) {

		const {
			backgroundType,
			className,
			hasParallax,
			url,
		} = props.attributes;

		const style = backgroundType === IMAGE_BACKGROUND_TYPE ?
			backgroundImageStyles( url ) :
			{};

		const classes = classnames(
			className,
			{
				'has-parallax': hasParallax,
			},
		);

		return (
			<div className={ classes } style={ style }>
				{ VIDEO_BACKGROUND_TYPE === backgroundType && url && ( <video
					className="wp-block-cover__video-background"
					autoPlay
					muted
					loop
					src={ url }
				/> ) }
				<InnerBlocks.Content />
			</div>
		);
	},
} );

function backgroundImageStyles( url ) {
	return url ?
		{ backgroundImage: `url(${ url })` } :
		{};
}
