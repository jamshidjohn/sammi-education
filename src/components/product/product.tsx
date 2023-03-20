import styles from './product.module.css';
import cn from 'classnames';
import { ProductProps } from './product.props';
import Card from '../card/card';
import Image from 'next/image';
import { convertToUSD, detectedReview } from '@/src/helpers/helpers';
import Tag from '../tag/tag';
import Rating from '../rating/rating';
import Divider from '../divider/divider';
import Button from '../button/button';
import { ForwardedRef, forwardRef, useRef, useState } from 'react';
import Review from '../review/review';
import ReviewForm from '../review-form/review-form';
import { motion } from 'framer-motion';

const Product = motion(
	forwardRef(({ product, className, ...props }: ProductProps, ref: ForwardedRef<HTMLDivElement>): JSX.Element => {
		const [reviewOpen, setReviewOpen] = useState<boolean>(false);
		const reviewRef = useRef<HTMLDivElement>(null);

		const scrollToReview = () => {
			setReviewOpen(true);
			reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};
		return (
			<div className={className} ref={ref} {...props}>
				<Card className={styles.product}>
					<div className={styles.logo}>
						<Image src={product.images} alt={product.title} width={70} height={70} />
					</div>
					<div className={styles.title}>{product.title}</div>
					<div className={styles.price}>
						{convertToUSD(product.price)}
						{product.oldPrice && (
							<Tag className={styles.oldPrice} color='green'>
								{convertToUSD(product.price - product.oldPrice)}
							</Tag>
						)}
					</div>
					<div className={styles.credit}>
						{convertToUSD(product.credit)}/<span className={styles.month}>month</span>
					</div>
					<div className={styles.rating}>
						<Rating rating={product.initialRating} />
					</div>
					<div className={styles.tags}>
						{product.tags.length &&
							product.tags.map(t => (
								<Tag key={t} className={styles.category} color={'primary'}>
									{t}
								</Tag>
							))}
					</div>
					<div className={styles.priceTitle}>Price</div>
					<div className={styles.creditTitle}>Credit</div>
					<div className={styles.rateTitle}>
						<a href='#review' onClick={scrollToReview}>
							{product.reviewCount} {detectedReview(product.reviewCount)}
						</a>
					</div>

					<Divider className={styles.hr} />

					<div className={styles.description}>{product.description}</div>

					<div className={styles.features}>
						{product.characteristics.length &&
							product.characteristics.map(ch => (
								<div className={styles.characteristic} key={ch.name}>
									<span className={styles.characteristicName}>{ch.name}</span>
									<span className={styles.characteristicDots}></span>
									<span className={styles.characteristicValue}>{ch.value}</span>
								</div>
							))}
					</div>

					<div className={styles.advBlock}>
						{product.advantages && (
							<div className={styles.advantages}>
								<div className={styles.advantageTitle}>Advantages</div>
								<div>{product.advantages}</div>
							</div>
						)}
						{product.disadvantages && (
							<div className={styles.disadvantages}>
								<div className={styles.disadvantageTitle}>Disadvantages</div>
								<div>{product.disadvantages}</div>
							</div>
						)}
					</div>

					<Divider className={styles.hr2} />

					<div className={styles.actions}>
						<Button appearance='primary'>More Details</Button>
						<Button
							appearance='ghost'
							arrow={reviewOpen ? 'down' : 'right'}
							className={styles.reviewBtn}
							onClick={() => setReviewOpen(prev => !prev)}
						>
							Review
						</Button>
					</div>
				</Card>

				<Card
					color='white'
					ref={reviewRef}
					className={cn(styles.review, {
						[styles.opened]: reviewOpen,
						[styles.closed]: !reviewOpen,
					})}
				>
					{product.reviews.map(r => (
						<div key={r._id}>
							<Review review={r} />
							<Divider />
						</div>
					))}
					<ReviewForm productId={product._id} />
				</Card>
			</div>
		);
	})
);

export default Product;
