import React, { useContext, useEffect, useState } from 'react'
import editorContext from '../context/editorContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BlogEntry, UserContext } from '../types/sharedTypes';

type MarkdownRestulProps = {
	preview?: boolean;
	context?: UserContext;
	blogEntry?: BlogEntry;
};


export const MarkdownResult = ({ preview = false, context, blogEntry }: MarkdownRestulProps) => {
	const { visualMarkdown, setVisualMarkdown, title: mainTitle, setMarkdownText } = useContext(editorContext);
	const [title, setTitle] = useState<string>('');
	const [toRender, setToRender] = useState<string>('');

	useEffect(() => {
		const titleToRemove = visualMarkdown.split('\n')[0] || blogEntry?.markdown?.split('\n')[0] || '';

		const generateUserInfo = (context: UserContext) => {
			const { lastName, name, email } = context;

			return {
				name: `> #### [${name} ${lastName}](mailto:${email})`,
				date: `> ${new Date().toLocaleDateString('es-us', { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
			};
		};


		if (preview && context) {
			const { name, date } = generateUserInfo(context as any);
			const toSet = titleToRemove + " \n" + name + "\n" + date + "\n";

			if(blogEntry) {
				setToRender(blogEntry.markdown.replace(titleToRemove, toSet));
			}

			if (!title && mainTitle !== toSet) {
				setTitle(toSet);
				setVisualMarkdown(visualMarkdown.replace(titleToRemove, toSet));
			}
		} else {
			const toRemove = visualMarkdown.split('\n')[1] + "\n" + visualMarkdown.split('\n')[2];
			if (!context && toRemove.includes('>')) {
				const toRemove = visualMarkdown.split('\n')[1] + "\n" + visualMarkdown.split('\n')[2];
				const newValue = visualMarkdown.replace(toRemove, '');
				setVisualMarkdown(newValue);
				setMarkdownText('markdown', newValue)
			}
		}
	}, [preview, visualMarkdown, context, setVisualMarkdown, title, mainTitle, setMarkdownText, blogEntry]);

	return (
		<>
			<div className={`markdownResult ${preview ? 'preview' : 'writing'} ${blogEntry ? 'readMarkdown' : ''}`}>
				<ReactMarkdown
					remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>{toRender || visualMarkdown}</ReactMarkdown>
			</div>
		</>
	)
};