import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createNotificationDTO } from 'src/dtos/createNotification.dto';
import { Article } from 'src/entities/article.entity';
import { Notification } from 'src/entities/notification.entity';
import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ReportStatus } from 'src/enums/report-status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  public async createReport(articleId: number, userId: number) {
    const article = await this.articleRepository.findOneBy({ id: articleId });
    const user = await this.userRepository.findOneBy({ id: userId });

    const reportData = {
      user: user,
      article: article,
      reportedOn: new Date(),
      status: ReportStatus.pending,
    };

    const report: Report = this.reportRepository.create(reportData);
    return this.reportRepository.save(report);
  }

  public async getPendingReports() {
    const reports = await this.reportRepository.find({
      where: {
        status: ReportStatus.pending,
      },
      relations: { article: true, user: true },
    });

    const data = reports.map((report: Report) => {
      return {
        id: report.id,
        articleTitle: report.article.title,
        articleText: report.article.text,
        reportedOn: report.reportedOn,
        username: report.user.username,
      };
    });

    return data;
  }

  public async updateReport(id: number, status: ReportStatus) {
    const report = await this.reportRepository.findOne({
      where: { id: id },
      relations: { article: true },
    });

    if (status == ReportStatus.rejected) {
      return this.reportRepository.update(report, {
        status: status,
        resolvedOn: new Date(),
      });
    }

    const article = await this.articleRepository.findOne({
      where: { id: report.article.id },
      relations: { reviews: true, reports: true, user: true },
    });

    article.reviews.forEach((review: Review) => {
      this.reviewRepository.remove(review);
    });

    article.reports.forEach((report: Report) =>
      this.reportRepository.remove(report),
    );

    const notificationData: createNotificationDTO = {
      userID: article.user.id,
      title: `Article "${article.title}" has been deleted`,
      message: `Your article "${article.title}" has beed removed by the admin, acording to the report of another platform user!`,
      articleID: article.id,
      deleteArticleOnReception: true,
    };

    this.articleRepository.remove(article);

    const notification = this.notificationRepository.create(notificationData);
    return this.notificationRepository.save(notification);
  }

  public getAll() {
    return this.reportRepository.find();
  }
}
